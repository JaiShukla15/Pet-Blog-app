const appConstants = require('../appConstants/appConstants');
const Category = require('../Modal/Category');
const { getLogger } = require('../utility/utility');
const logger = getLogger();
module.exports = {
    setCategory: (category) => {
        return new Promise((resolve, reject) => {
            Category.updateMany({ category: category }, { $inc: { percentages: 1 } }, { upsert: true }).then((data) => {
                logger.info({ message: data });
                resolve({ success: true, data })
            }).catch(error => {
                logger.error({ message: error });
                reject({ success: false });
            });
        })
    },
    getCategory: (req, res) => {
        Category.find({}).then((data) => {
            logger.info({ message: data })
            res.json({ success: true, data })
        }).catch(error => {
            logger.error({ message: error })
            res.json({ success: false })
        })

    }
}