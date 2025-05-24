const shapeToUrl = {
    'Round': require('./images/round.jpg'),
    'Oval': require('./images/oval.jpg'),
    'Princess': require('./images/princess.jpg'),
    'Cushion': require('./images/cushion.jpg'),
    'Pear': require('./images/pear.jpg'),
    'Emerald': require('./images/emerald.jpg'),
    'Marquise': require('./images/marquise.jpg'),
    'Radiant': require('./images/radiant.jpg'),
    'Asscher': require('./images/asscher.jpg'),
    'Heart': require('./images/heart.jpg'),
};

const gemstoneToUrl = {
    'Diamond': require('./images/diamond.png'),
    'Ruby': require('./images/ruby.png'),
    'Sapphire': require('./images/sapphire.png'),
    'Emerald': require('./images/emerald.png'),
    'Amethyst': require('./images/amethyst.png'),
    'Topaz': require('./images/topaz.png'),
    'Aquamarine': require('./images/aquamarine.png'),
    'Tanzanite': require('./images/tanzanite.png'),
    'Morganite': require('./images/morganite.png'),
    'Alexandrite': require('./images/alexandrite.png'),
    'Tourmaline': require('./images/tourmaline.png'),
    'Spinel': require('./images/spinel.png'),
    'Zircon': require('./images/zircon.png'),
    'Jade': require('./images/jade.png'),
    'Opal': require('./images/opal.png'),
    'Garnet': require('./images/garnet.png'),
    'Pearl': require('./images/pearl.png'),
    'Peridot': require('./images/peridot.png'),
    'Turquoise': require('./images/turquoise.png'),
    'Citrine': require('./images/citrine.png'),
    'Moonstone': require('./images/moonstone.png'),
    'Quartz': require('./images/quartz.png'),
    'Amber': require('./images/amber.png'),
    'Coral': require('./images/coral.png'),
    'Bloodstone': require('./images/bloodstone.png'),
    'Malachite': require('./images/malachite.png'),
    'Chrysoprase': require('./images/chrysoprase.png'),
    'LapisLazuli': require('./images/lapisLazuli.png'),
    'Onyx': require('./images/onyx.png'),
    'No': require('./images/no.png'),
};

export const getGemShapeImage = (shape) => {
    return shapeToUrl[shape] || '';
};

export const getGemstoneImage = (gemstone) => {
    return gemstoneToUrl[gemstone] || '';
};