const express = require('express');
const router = express.Router()
const FormData = require('./formSchema')


router.post('/submitForm', async (req, res) => {
    try {
        const {businessName, businessRegistrationNumber, facilityType, facilitySize} = req.body

        const newFormBody = new FormData({
            businessName,
            businessRegistrationNumber,
            facilityType,
            facilitySize
        })

        const savedData = await newFormBody.save()

        res.status(201).json({ message: 'Form data saved', data:savedData})
    } catch (error) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router