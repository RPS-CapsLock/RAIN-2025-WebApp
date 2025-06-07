const PaketnikModel = require('../models/paketnikModel.js');

module.exports = {

    // 📚 Pridobi vse paketnike
    list: async function (req, res) {
        try {
            const paketniki = await PaketnikModel.find();
            return res.json(paketniki);
        } catch (err) {
            return res.status(500).json({
                message: 'Napaka pri pridobivanju paketnikov.',
                error: err
            });
        }
    },

    // 📚 Pridobi vse paketnike določenega ownerja
    getMyPaketniki: async function (req, res) {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not logged in" });
        }
        try {
            const paketniki = await PaketnikModel.find({ owner: req.session.userId });
            return res.json(paketniki);
        } catch (err) {
            return res.status(500).json({
                message: 'Napaka pri iskanju paketnikov.',
                error: err
            });
        }
    },

    // 📦 Pridobi posamezen paketnik po ID-ju
    show: async function (req, res) {
        const id = req.params.id;

        try {
            const paketnik = await PaketnikModel.findById(id);
            if (!paketnik) {
                return res.status(404).json({ message: 'Paketnik ni bil najden.' });
            }
            return res.json(paketnik);
        } catch (err) {
            return res.status(500).json({
                message: 'Napaka pri iskanju paketnika.',
                error: err
            });
        }
    },

    // ➕ Ustvari nov paketnik
    create: async function (req, res) {
        try {
            const paketnik = new PaketnikModel({
                number: req.body.number,
                owner: req.body.owner,
                location: req.body.location,
                status: req.body.status || 'available'
            });

            const savedPaketnik = await paketnik.save();
            return res.status(201).json(savedPaketnik);
        } catch (err) {
            return res.status(500).json({
                message: 'Napaka pri ustvarjanju paketnika.',
                error: err
            });
        }
    },

    // ✏️ Posodobi obstoječ paketnik
    update: async function (req, res) {
        const id = req.params.id;

        try {
            const paketnik = await PaketnikModel.findById(id);
            if (!paketnik) {
                return res.status(404).json({ message: 'Paketnik ni bil najden.' });
            }

            // Posodobimo samo obstoječa polja
            paketnik.number = req.body.number !== undefined ? req.body.number : paketnik.number;
            paketnik.owner = req.body.owner !== undefined ? req.body.owner : paketnik.owner;
            paketnik.location = req.body.location !== undefined ? req.body.location : paketnik.location;
            paketnik.status = req.body.status !== undefined ? req.body.status : paketnik.status;

            const updatedPaketnik = await paketnik.save();
            return res.json(updatedPaketnik);
        } catch (err) {
            return res.status(500).json({
                message: 'Napaka pri posodabljanju paketnika.',
                error: err
            });
        }
    },

    // ❌ Izbriši paketnik
    remove: async function (req, res) {
        const id = req.params.id;

        try {
            await PaketnikModel.findByIdAndDelete(id);
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({
                message: 'Napaka pri brisanju paketnika.',
                error: err
            });
        }
    },

    // 📝 Dodaj log status paketniku
    logBoxStatus: async function (req, res) {
        const id = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        try {
            const paketnik = await PaketnikModel.findById(id);
            if (!paketnik) {
                return res.status(404).json({ message: 'Paketnik ni bil najden.' });
            }

            paketnik.open_logs.push({ status });

            const updatedPaketnik = await paketnik.save();
            return res.status(200).json({ message: 'Log added successfully.', logs: updatedPaketnik.open_logs });
        } catch (err) {
            return res.status(500).json({
                message: 'Napaka pri shranjevanju loga.',
                error: err
            });
        }
    }
};
