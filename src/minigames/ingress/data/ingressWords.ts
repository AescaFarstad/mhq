type IngressWordsData = {
    useful: {
        trivial: string[];
        minor: string[];
        major: string[];
        special: string[];
        cheat: string[];
    };
    offensive: string[];
};

export const ingressWordDefinitions: IngressWordsData = {
    useful: {
        special: ["luck", "music"],
        major: ['aspect', 'vessel', 'incarnation', 'flesh', 'hunger', 'threshold', 'dwelling', 'sinew', 'covenant', 'ephemeral', 'tether','manifestation', 'corporeal', 'embodiment', 'transubstantiation', 'quickening', 'anima', 'pneuma', 'nascence', 'chrysalis','sublimation', 'emanation', 'immanence', 'viscera', 'marrow', 'ichor', 'quintessence', 'avatar', 'effigy', 'homunculus','tabernacle', 'sanctum', 'reliquary', 'phylactery', 'receptacle', 'crucible', 'athanor', 'liminal', 'interstice', 'nexus','syzygy', 'confluence', 'apotheosis', 'kenosis', 'theophany', 'hierophany', 'parousia', 'metanoia', 'henosis', 'templum', 'simulacrum', 'quiddity', 'hypostasis', 'gestalt', 'eidolon', 'protoplasm', 'genesis', 'alembic', 'soma', 'numen', 'physis', 'golem', 'haecceity', 'azoth', 'thaumaturgy'],
        
        minor: ['human', 'mortal', 'body', 'soul', 'breath', 'form', 'birth', 'clay', 'transcendence', 'pulse', 'shadow', 'bridge', 'anchor', 'prism','being', 'essence', 'substance', 'matter', 'corpus', 'frame', 'shell', 'husk', 'cocoon', 'membrane', 'tissue', 'fiber', 'cord','vein', 'artery', 'nerve', 'muscle', 'organ', 'cell', 'atom', 'particle', 'spark', 'flame', 'ember', 'ash', 'dust', 'salt','blood', 'sweat', 'tear', 'saliva', 'bile', 'lymph', 'plasma', 'serum', 'humor', 'nectar', 'ambrosia', 'manna', 'bread','wine', 'water', 'oil', 'milk', 'honey', 'grain', 'seed', 'fruit', 'root', 'branch', 'leaf', 'flower', 'pollen', 'spore','womb', 'egg', 'embryo', 'fetus', 'infant', 'child', 'youth', 'adult', 'elder', 'ancestor', 'descendant', 'lineage', 'heritage','memory', 'dream', 'vision', 'thought', 'feeling', 'emotion', 'sensation', 'perception', 'consciousness', 'awareness', 'instinct','reflex', 'habit', 'pattern', 'rhythm', 'cycle', 'season', 'phase', 'stage', 'moment', 'instant', 'duration', 'interval','presence', 'absence', 'void', 'vacuum', 'space', 'place', 'location', 'position', 'dimension', 'plane', 'realm', 'domain','element', 'compound', 'mixture', 'solution', 'precipitate', 'catalyst', 'reagent', 'medium', 'matrix', 'substrate', 'lattice', 'skeleton', 'brain', 'lung', 'spine', 'spirit', 'ghost', 'shape', 'voice', 'veneer', 'vestige', 'semblance', 'suture', 'conduit', 'fulcrum', 'gestation', 'locus', 'patina', 'cipher', 'stomach', 'liver'],
        
        trivial: ['life', 'death', 'time', 'world', 'earth', 'ground', 'link', 'change', 'path', 'door', 'light', 'dark', 'bone', 'skin', 'heart', 'mind', 'hand', 'foot', 'tree', 'stone', 'air', 'fire', 'water', 'dirt', 'mud', 'sand', 'rock', 'metal', 'wood', 'glass', 'cloth', 'paper', 'ink', 'paint', 'color', 'red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'brown', 'purple', 'orange', 'pink', 'gold', 'silver', 'copper', 'sun', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'wind', 'storm', 'thunder', 'lightning', 'fog', 'mist', 'dew', 'frost', 'day', 'night', 'dawn', 'dusk', 'noon', 'midnight', 'morning', 'evening', 'afternoon', 'twilight', 'hour', 'minute', 'second', 'year', 'month', 'week', 'house', 'home', 'room', 'wall', 'floor', 'ceiling', 'roof', 'window', 'stairs', 'hall', 'kitchen', 'bedroom', 'bathroom', 'table', 'chair', 'bed', 'desk', 'shelf', 'cabinet', 'drawer', 'closet', 'mirror', 'lamp', 'candle', 'torch', 'lantern', 'book', 'page', 'word', 'letter', 'sentence', 'paragraph', 'chapter', 'story', 'tale', 'song', 'poem', 'verse', 'rhyme', 'food', 'drink', 'meal', 'breakfast', 'lunch', 'dinner', 'snack', 'feast', 'famine', 'hunger', 'thirst', 'appetite', 'sleep', 'wake', 'rest', 'work', 'play', 'run', 'walk', 'stand', 'sit', 'jump', 'climb', 'fall', 'rise', 'turn', 'love', 'hate', 'fear', 'joy', 'sorrow', 'anger', 'peace', 'war', 'friend', 'enemy', 'stranger', 'family', 'parent', 'child', 'man', 'woman', 'person', 'people', 'crowd', 'group', 'team', 'community', 'society', 'culture', 'tradition', 'custom', 'king', 'queen', 'prince', 'princess', 'lord', 'lady', 'knight', 'peasant', 'merchant', 'soldier', 'priest', 'mage', 'sword', 'shield', 'armor', 'helmet', 'spear', 'bow', 'arrow', 'dagger', 'staff', 'wand', 'ring', 'amulet', 'crown', 'coin', 'treasure', 'wealth', 'poverty', 'trade', 'market', 'shop', 'goods', 'price', 'value', 'road', 'street', 'alley', 'square', 'bridge', 'gate', 'tower', 'castle', 'palace', 'temple', 'church', 'shrine', 'altar', 'forest', 'mountain', 'valley', 'river', 'lake', 'ocean', 'island', 'desert', 'plain', 'hill', 'cave', 'cliff', 'shore', 'animal', 'bird', 'fish', 'insect', 'plant', 'flower', 'grass', 'bush', 'vine', 'moss', 'mushroom', 'garden', 'field', 'first', 'last', 'big', 'small', 'large', 'tiny', 'huge', 'tall', 'short', 'long', 'wide', 'narrow', 'thick', 'thin', 'heavy', 'light', 'hot', 'cold', 'warm', 'cool', 'wet', 'dry', 'soft', 'hard', 'smooth', 'rough', 'sharp', 'dull', 'bright', 'dim', 'fast', 'slow', 'quick', 'old', 'new', 'young', 'today', 'tomorrow', 'yesterday', 'now', 'today', 'good', 'bad', 'right', 'wrong', 'touch', 'smell', 'eye', 'ear', 'nose', 'lip', 'chin', 'cheek', 'hair', 'finger', 'toe', 'nail', 'hope', 'doubt', 'grief', 'guilt', 'pride', 'shame', 'shirt', 'shoe', 'hat', 'belt', 'rope', 'key', 'lock', 'hammer', 'chain', 'city', 'town', 'village', 'inn', 'farm', 'market', 'coin', 'cup', 'plate', 'bowl', 'fork', 'spoon', 'knife', 'meat', 'cheese', 'sugar', 'soil', 'pebble', 'twig', 'bark', 'thorn', 'petal', 'stream', 'pond', 'boulder'],
        cheat: ['aesca'],
    },
    offensive: [
        'fuck',
        'shit',
        'cunt',
        'dick',
        'asshole',
        'bastard',
        'bitch',
        'whore',
        'slut',
        'boredom',
        'despair',
    ]
} 