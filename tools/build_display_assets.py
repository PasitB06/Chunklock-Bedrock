"""Generate matching flat-icon script indices and client texture references."""
import argparse
import json
from pathlib import Path
import re
import struct
import zlib

ROOT = Path(__file__).resolve().parents[1]
RP = ROOT / 'resource_packs/chunklock'


def png_chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)


def fallback_png():
    # Original question-mark artwork; no Vanilla image data is redistributed.
    glyph = ['01110', '10001', '00001', '00010', '00100', '00000', '00100']
    rows = bytearray()
    for y in range(16):
        rows.append(0)
        for x in range(16):
            marked = 5 <= x < 10 and 4 <= y < 11 and glyph[y - 4][x - 5] == '1'
            rows.extend((255, 255, 255, 255) if marked else (80, 25, 95, 255))
    return (b'\x89PNG\r\n\x1a\n' + png_chunk(b'IHDR', struct.pack('!2I5B', 16, 16, 8, 6, 0, 0, 0))
            + png_chunk(b'IDAT', zlib.compress(rows)) + png_chunk(b'IEND', b''))


def shape_for(item_id, texture):
    if not texture or not texture.startswith('textures/blocks/'):
        return 0
    name = item_id.split(':')[1]
    if name.endswith(('_pressure_plate', '_carpet')): return 2
    if name.endswith('_slab') or name == 'daylight_detector': return 3
    if name.endswith('_stairs'): return 4
    if name.endswith('_fence'): return 5
    if name.endswith('_wall'): return 6
    if name.endswith('_fence_gate'): return 7
    if name.endswith(('_trapdoor', '_pane')): return 8
    if name.endswith('_banner'): return 9
    if name.endswith('_button'): return 10
    if re.search(r'(sapling|flower|grass|fern|bush|mushroom|fungus|roots|vine|lilac|peony|tulip|orchid|poppy|dandelion|rail|torch|web|kelp|seagrass|lichen|coral_fan|petals|sprouts|propagule|sugar_cane|lily_pad|lily_of_the_valley|sunflower|rose_bush|allium|bluet|cornflower|daisy|deadbush|pointed_dripstone|sculk_vein|tripwire_hook|spore_blossom|end_rod|lightning_rod)', name):
        return 0
    return 1


def shape_geometry():
    # Center every model inside the 0.85-block click box (y = 0..13.6 model units) with a fixed tilt.
    y_center = 6.8
    boxes = {
        1: [([-4.5, -4.5, -4.5], [9, 9, 9])],
        2: [([-4.5, -0.45, -4.5], [9, 0.9, 9])],
        3: [([-4.5, -2.25, -4.5], [9, 4.5, 9])],
        4: [([-4.5, -4.5, -4.5], [9, 4.5, 9]), ([-4.5, 0, 0], [9, 4.5, 4.5])],
        5: [([-5, -5.5, -1.5], [2.8, 11, 3]), ([2.2, -5.5, -1.5], [2.8, 11, 3]), ([-5.5, 1.5, -0.75], [11, 1.5, 1.5]), ([-5.5, -2.5, -0.75], [11, 1.5, 1.5])],
        6: [([-2.25, -5.5, -2.25], [4.5, 11, 4.5]), ([-5.5, -4.5, -1.5], [11, 7.5, 3])],
        7: [([-5.5, -4.5, -0.75], [1.5, 9, 1.5]), ([4, -4.5, -0.75], [1.5, 9, 1.5]), ([-4, 1.5, -0.75], [8, 1.5, 1.5]), ([-4, -2.5, -0.75], [8, 1.5, 1.5])],
        8: [([-4.5, -4.5, -0.6], [9, 9, 1.2])],
        9: [([-3, -5.5, -0.45], [6, 11, 0.9])],
        10: [([-2.7, -1.8, -1.8], [5.4, 3.6, 3.6])]
    }
    shape_count = len(boxes) + 1
    result = []
    for shape in range(shape_count):
        if shape == 0:
            cubes = [{'origin': [-6, y_center - 6, -0.01], 'size': [12, 12, 0.02],
                      'uv': {face: {'uv': [0, 0], 'uv_size': [16, 16]} for face in ['north', 'south']}}]
        else:
            cubes = [{'origin': [origin[0], origin[1] + y_center, origin[2]], 'size': size,
                      'pivot': [0, y_center, 0], 'rotation': [25, 45, 0],
                      'uv': {face: {'uv': [0, 0], 'uv_size': [16, 16]} for face in ['north', 'south', 'east', 'west', 'up', 'down']}}
                     for origin, size in boxes[shape]]
        result.append({'description': {'identifier': f'geometry.chunklock.requirement_shape_{shape}',
                       'texture_width': 16, 'texture_height': 16, 'visible_bounds_width': 2,
                       'visible_bounds_height': 2, 'visible_bounds_offset': [0, 0.425, 0]},
                       'bones': [{'name': 'root', 'pivot': [0, 0, 0], 'cubes': cubes}]})
    return {'format_version': '1.12.0', 'minecraft:geometry': result}


def outputs():
    catalog = json.loads((ROOT / 'tools/display-icon-catalog.json').read_text(encoding='utf-8'))
    items = catalog['items']
    required = set(re.findall(r'name:\s*"(minecraft:[^"/]+)"',
                              (ROOT / 'scripts/loot-tables-data.ts').read_text(encoding='utf-8')))
    required.update(['minecraft:short_grass', 'minecraft:stone', 'minecraft:flint'])
    if required - items.keys():
        raise ValueError(f'Missing icon mappings: {sorted(required - items.keys())}')
    for item_id, texture in items.items():
        if not re.fullmatch(r'minecraft:[a-z0-9_]+', item_id):
            raise ValueError(f'Invalid item ID: {item_id}')
        if texture is not None and not re.fullmatch(r'textures/[a-z0-9_/]+', texture):
            raise ValueError(f'Invalid texture path: {texture}')
    order = catalog['icon_order']
    if len(order) != len(set(order)) or set(order) != set(items):
        raise ValueError('icon_order must contain every catalog item exactly once; append new IDs only.')
    fallback = 'textures/entity/chunklock/unknown_icon'
    textures = [fallback] + [items[item_id] or fallback for item_id in order]
    mapping = {item_id: index for index, item_id in enumerate(order, 1)}
    mapping['minecraft:grass'] = mapping['minecraft:short_grass']
    script = ('/* Generated by tools/build_display_assets.py. Do not edit by hand. */\n'
              'export const DISPLAY_ICON_INDEX: Readonly<Record<string, number>> = {\n')
    script += ''.join(f'  "{item_id}": {index},\n' for item_id, index in sorted(mapping.items()))
    script += ('};\n\nexport function displayIconIndex(itemId: string): number {\n'
               '  return Object.prototype.hasOwnProperty.call(DISPLAY_ICON_INDEX, itemId) ? DISPLAY_ICON_INDEX[itemId] : 0;\n}\n')
    shapes = {item_id: shape_for(item_id, texture) for item_id, texture in items.items()}
    script += '\nexport const DISPLAY_SHAPES: Readonly<Record<string, number>> = {\n'
    script += ''.join(f'  "{item_id}": {shape},\n' for item_id, shape in sorted(shapes.items()))
    script += '};\n\nexport function displayShape(itemId: string): number {\n  return Object.prototype.hasOwnProperty.call(DISPLAY_SHAPES, itemId) ? DISPLAY_SHAPES[itemId] : 0;\n}\n'
    shape_count = len(shape_geometry()['minecraft:geometry'])
    client = {
        'format_version': '1.10.0',
        'minecraft:client_entity': {'description': {
            'identifier': 'chunklock:requirement_display',
            'materials': {'default': 'entity_alphatest'},
            'textures': {f'icon_{index}': texture for index, texture in enumerate(textures)},
            'geometry': {f'shape_{index}': f'geometry.chunklock.requirement_shape_{index}' for index in range(shape_count)},
            'animations': {'pose': 'animation.chunklock.requirement_display.pose'},
            'scripts': {'animate': ['pose']},
            'render_controllers': ['controller.render.chunklock.requirement_display_v2']
        }}
    }
    controller = {
        'format_version': '1.8.0',
        'render_controllers': {'controller.render.chunklock.requirement_display_v2': {
            'arrays': {'textures': {'Array.icons': [f'Texture.icon_{index}' for index in range(len(textures))]},
                       'geometries': {'Array.shapes': [f'Geometry.shape_{index}' for index in range(shape_count)]}},
            'geometry': "Array.shapes[query.property('chunklock:display_shape')]", 'materials': [{'*': 'Material.default'}],
            'textures': ["Array.icons[query.property('chunklock:display_icon_v2')]"], 'ignore_lighting': True
        }}
    }
    behavior_path = ROOT / 'behavior_packs/chunklock/entities/requirement_display.json'
    behavior = json.loads(behavior_path.read_text(encoding='utf-8'))
    behavior['minecraft:entity']['description']['properties'].pop('chunklock:display_icon', None)
    behavior['minecraft:entity']['description']['properties']['chunklock:display_icon_v2'] = {
        'type': 'int', 'range': [0, len(textures) - 1], 'default': 0, 'client_sync': True
    }
    behavior['minecraft:entity']['description']['properties']['chunklock:display_shape'] = {
        'type': 'int', 'range': [0, shape_count - 1], 'default': 0, 'client_sync': True
    }
    encode = lambda value: (json.dumps(value, indent=2) + '\n').encode('utf-8')
    return {
        ROOT / 'scripts/display-icons-data.ts': script.encode('utf-8'),
        RP / 'entity/requirement_display.entity.json': encode(client),
        RP / 'models/entity/requirement_display.geo.json': encode(shape_geometry()),
        RP / 'render_controllers/requirement_display.render_controllers.json': encode(controller),
        RP / 'textures/entity/chunklock/unknown_icon.png': fallback_png(),
        behavior_path: encode(behavior)
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    generated = outputs()
    stale = []
    for path, content in generated.items():
        if args.check:
            # Git may check out text with CRLF on an external clone.
            actual = path.read_bytes() if path.exists() else b''
            if path.suffix != '.png':
                actual = actual.replace(b'\r\n', b'\n')
            if actual != content:
                stale.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
    if stale:
        raise SystemExit('Stale display assets: ' + ', '.join(stale))
    print(f'{"Checked" if args.check else "Generated"} {len(generated)} flat display assets.')


if __name__ == '__main__':
    main()
