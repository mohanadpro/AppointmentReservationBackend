const mongoose = require('mongoose');

const AppSettingsReservationSchema = mongoose.Schema({
      startHour: {
            type: Number,
            default: 9,
            required: true
      },
      endHour: {
            type: Number,
            default: 18,
            required: true
      },
      howManyPatientInHour: {
            type: Number,
            default: 1,
            required: true
      },
      hasBreak: {
            type: Boolean,
            default: false,
            required: true
      },
      whichHour: {
            type: String,
            default: 12,
            required: false
      },
      howMuch: {
            type: Number,
            default: 1,
            required: true
      },
})

module.exports = mongoose.model('AppSettingsReservation', AppSettingsReservationSchema)