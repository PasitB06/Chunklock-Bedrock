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
        'description': {'identifier': 'chunklock:border_wall', 'is_spawnable': False, 'is_summonable': True},
        'components': {
            'minecraft:physics': {'has_gravity': False, 'has_collision': False},
            'minecraft:collision_box': {'width': 0, 'height': 0},
            'minecraft:health': {'value': 100, 'max': 100},
            'minecraft:damage_sensor': {'triggers': [{'deals_damage': 'no'}]},
            'minecraft:breathable': {'total_supply': -1, 'suffocate_time': -1,
                                    'breathes_air': True, 'breathes_water': True,
                                    'breathes_solids': True, 'generates_bubbles': False},
            'minecraft:pushable': {'is_pushable': False, 'is_pushable_by_piston': False},
            'minecraft:fire_immune': {}, 'minecraft:persistent': {}
        }
    }
})
write(RP / 'entity/border_wall.entity.json', {
    'format_version': '1.10.0',
    'minecraft:client_entity': {'description': {
        'identifier': 'chunklock:border_wall',
        'materials': {'default': 'entity_alphablend'},
        'textures': {'default': 'textures/entity/border_wall'},
        'geometry': {'default': 'geometry.chunklock.border_wall'},
        'render_controllers': ['controller.render.chunklock.border_wall']
    }}
})
write(RP / 'render_controllers/border_wall.render_controllers.json', {
    'format_version': '1.8.0',
    'render_controllers': {'controller.render.chunklock.border_wall': {
        'geometry': 'Geometry.default', 'materials': [{'*': 'Material.default'}],
        'textures': ['Texture.default']
    }}
})
# Exact tile edges avoid overlapping adjacent faces. Two-pixel thickness keeps
# opposite translucent surfaces farther apart than the original subpixel slab.
write(RP / 'models/entity/border_wall.geo.json', {
    'format_version': '1.12.0',
    'minecraft:geometry': [{
        'description': {'identifier': 'geometry.chunklock.border_wall', 'texture_width': 16,
                        'texture_height': 16, 'visible_bounds_width': 18,
                        'visible_bounds_height': 66, 'visible_bounds_offset': [0, 32, 0]},
        'bones': [{'name': 'wall', 'pivot': [0, 0, 0], 'cubes': [{
            'origin': [-128, tile * 256, -1], 'size': [256, 256, 2],
            'uv': {face: {'uv': [0, 0], 'uv_size': [16, 16]}
                   for face in ['north', 'south']}
        } for tile in range(4)]}]
    }]
})


def chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)


rows = bytearray()
for y in range(16):
    rows.append(0)
    for x in range(16):
        rows.extend((45, 185, 255, 30))
png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', 16, 16, 8, 6, 0, 0, 0))
png += chunk(b'IDAT', zlib.compress(bytes(rows))) + chunk(b'IEND', b'')
texture = RP / 'textures/entity/border_wall.png'
texture.parent.mkdir(parents=True, exist_ok=True)
texture.write_bytes(png)
print('Generated wall behavior, client entity, geometry, render controller and RGBA texture.')
