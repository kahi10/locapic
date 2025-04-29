const checkBody = (req, inputs) => inputs.every(el => req[el]?.toString().trim());

module.exports = { checkBody };
