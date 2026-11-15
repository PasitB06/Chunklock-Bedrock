import { argv, parallel, series, task, tscTask } from "just-scripts";
import {
  BundleTaskParameters,
  CopyTaskParameters,
  bundleTask,
  cleanTask,
  copyTask,
  coreLint,
  mcaddonTask,
  setupEnvironment,
  ZipTaskParameters,
  DEFAULT_CLEAN_DIRECTORIES,
  getGameDeploymentRootPaths,
  getOrThrowFromProcess,
  MinecraftProduct,
  watchTask,
} from "@minecraft/core-build-tasks";
import path from "path";

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");
if (!/^[a-z0-9][a-z0-9_-]*$/i.test(projectName)) {
  throw new Error("PROJECT_NAME must contain only letters, numbers, underscores or hyphens.");
}

// Limit cleanup to this pack in the selected Minecraft installation.
const product = getOrThrowFromProcess("MINECRAFT_PRODUCT") as MinecraftProduct;
const deploymentRoot = getGameDeploymentRootPaths()[product];
if (!deploymentRoot) {
  throw new Error("Minecraft deployment path is missing. Check .env.");
}
const deployedPackPaths = [
  path.resolve(deploymentRoot, "development_behavior_packs", projectName),
  path.resolve(deploymentRoot, "development_resource_packs", projectName),
];

// You can use `npm run build:production` to build a "production" build that strips out statements labelled with "dev:".
const isProduction = argv()["production"];

const bundleTaskOptions: BundleTaskParameters = {
  entryPoint: path.join(__dirname, "./scripts/main.ts"),
  external: ["@minecraft/server", "@minecraft/server-ui"],
  outfile: path.resolve(__dirname, "./dist/scripts/main.js"),
  minifyWhitespace: false,
  sourcemap: true,
  outputSourcemapPath: path.resolve(__dirname, "./dist/debug"),
  dropLabels: isProduction ? ["dev"] : undefined,
};

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: [`./behavior_packs/${projectName}`],
  copyToScripts: ["./dist/scripts"],
  copyToResourcePacks: [`./resource_packs/${projectName}`],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: `./dist/packages/${projectName}.mcaddon`,
};

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task("typescript", tscTask());
task("bundle", bundleTask(bundleTaskOptions));
task("build", series("typescript", "bundle"));

// Clean
task("clean-local", cleanTask(DEFAULT_CLEAN_DIRECTORIES));
task("clean-collateral", cleanTask(deployedPackPaths));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task("copyArtifacts", copyTask(copyTaskOptions));
task("package", series("clean-collateral", "copyArtifacts"));

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task(
  "local-deploy",
  watchTask(
    ["scripts/**/*.ts", "behavior_packs/**/*.{json,lang,png}", "resource_packs/**/*.{json,lang,png,material}"],
    series("clean-local", "build", "package")
  )
);

// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions));
task("mcaddon", series("clean-local", "build", "createMcaddonFile"));
