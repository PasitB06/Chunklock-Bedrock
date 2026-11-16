"""Generate the original simple wall model and procedural RGBA texture."""
import json
from pathlib import Path
import struct
import zlib

ROOT = Path(__file__).resolve().parents[1]
BP = ROOT / 'behavior_packs/chunklock'
RP = ROOT / 'resource_packs/chunklock'


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')


write(BP / 'entities/border_wall.json', {
    'format_version': '1.21.0',
    'minecraft:entity': {
        'description': {'identifier': 'chunklock:border_wall', 'is_spawnable': False, 'is_summonable': True,
                        'properties': {'chunklock:wall_yaw': {'type': 'int', 'range': [0, 90], 'default': 0, 'client_sync': True}}},
        'components': {
            'minecraft:physics': {'has_gravity': False, 'has_collision': False, 'push_towards_closest_space': False},
            'minecraft:collision_box': {'width': 0, 'height': 0},
            'minecraft:health': {'value': 100, 'max': 100},
            'minecraft:damage_sensor': {'triggers': [{'deals_damage': 'no'}]},
            'minecraft:breathable': {'total_supply': -1, 'suffocate_time': -1,
                                    'breathes_air': True, 'breathes_water': True,
                                    'breathes_solids': True, 'generates_bubbles': False},
            'minecraft:pushable': {'is_pushable': False, 'is_pushable_by_piston': False},
            'minecraft:body_rotation_axis_aligned': {},
            'minecraft:fire_immune': {}, 'minecraft:persistent': {}
        }
    }
})
write(RP / 'materials/entity.material', {
    'materials': {
        'version': '1.0.0',
        'chunklock_border_wall:entity_alphablend': {
            '+states': [
                'Blending',
                'DisableDepthWrite',
                'DisableAlphaWrite'
            ]
        }
    }
})
write(RP / 'animations/border_wall.animation.json', {
    'format_version': '1.8.0',
    'animations': {
        'animation.chunklock.border_wall.align': {
            'loop': True,
            'bones': {
                'wall': {
                    'rotation': [
                        0,
                        "query.property('chunklock:wall_yaw') - query.body_y_rotation",
                        0
                    ]
                }
            }
        }
    }
})
write(RP / 'entity/border_wall.entity.json', {
    'format_version': '1.21.80',
    'minecraft:client_entity': {'description': {
        'identifier': 'chunklock:border_wall',
        'materials': {'default': 'chunklock_border_wall'},
        'textures': {'default': 'textures/entity/border_wall',
                     'vibrant': 'textures/entity/border_wall_vibrant'},
        'geometry': {'default': 'geometry.chunklock.border_wall'},
        'animations': {'align': 'animation.chunklock.border_wall.align'},
        'scripts': {'animate': ['align']},
        'render_controllers': ['controller.render.chunklock.border_wall']
    }}
})
write(RP / 'render_controllers/border_wall.render_controllers.json', {
    'format_version': '1.8.0',
    'render_controllers': {'controller.render.chunklock.border_wall': {
        'geometry': 'Geometry.default',
        'materials': [{'*': 'Material.default'}],
        'textures': ["query.graphics_mode_is_any('deferred') ? Texture.vibrant : Texture.default"],
        'ignore_lighting': True
    }}
})
# Use a single uniform-color column cube without overlapping vertical tiles or corner overhangs
# so coplanar Z-fighting and depth-buffer flicker cannot occur when moving the camera.
write(RP / 'models/entity/border_wall.geo.json', {
    'format_version': '1.12.0',
    'minecraft:geometry': [{
        'description': {'identifier': 'geometry.chunklock.border_wall', 'texture_width': 16,
                        'texture_height': 16, 'visible_bounds_width': 48,
                        'visible_bounds_height': 800, 'visible_bounds_offset': [0, 0, 0]},
        'bones': [{'name': 'wall', 'pivot': [0, 0, 0], 'cubes': [{
            'origin': [-128, -6144, -0.15], 'size': [256, 12288, 0.3],
            'uv': {face: {'uv': [0, 0], 'uv_size': [16, 16]}
                   for face in ['north', 'south']}
        }]}]
    }]
})


def chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)


def write_wall_texture(name, alpha):
    rows = bytearray()
    for y in range(16):
        rows.append(0)
        for x in range(16):
            rows.extend((25, 95, 220, alpha))
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', 16, 16, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(bytes(rows))) + chunk(b'IEND', b'')
    texture = RP / f'textures/entity/{name}.png'
    texture.parent.mkdir(parents=True, exist_ok=True)
    texture.write_bytes(png)


# Keep Simple/Fancy at alpha 85; lower deferred emissive opacity so terrain remains clearly visible.
write_wall_texture('border_wall', 85)
write_wall_texture('border_wall_vibrant', 75)
# Deferred lighting can darken a wall to black even when ignore_lighting is set.
# Explicit emissive PBR keeps the presentation visible without global lighting overrides.
write(RP / 'textures/entity/border_wall_vibrant.texture_set.json', {
    'format_version': '1.21.30',
    'minecraft:texture_set': {
        'color': 'border_wall_vibrant',
        'metalness_emissive_roughness_subsurface': [0, 255, 255, 0]
    }
})
print('Generated wall assets with graphics-mode-specific opacity and emissive PBR.')
