const User = require('../models/User')
const Deck = require('../models/Deck')
const Joi = require('@hapi/joi')
const idSchema = Joi.object().keys({
    userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const getDeck = async (req, res, next) => {
    const deck = await Deck.findById(req.value.params.deckID)
    return res.status(200).json({ deck })
}

const getAllDeck = async (req, res, next) => {
    const decks = await Deck.find({})

    return res.status(200).json({ decks })
}

const newDeck = async (req, res, next) => {
    //Find owner 
    const owner = await User.findById(req.value.body.owner)

    //Create a new deck
    const deck = req.value.body
    delete deck.owner
    deck.owner = owner._id

    const newDeck = new Deck(deck)
    await newDeck.save()

    //add newly create deck to the actual deck

    owner.decks.push(newDeck._id)
    await owner.save()

    return res.status(201).json({ deck: newDeck })
}

const replaceDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    //Check if put user, remove deck in user's model
    return res.status(200).json({ success: true })
}

const updateDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    //Check if put user, remove deck in user's model
    return res.status(200).json({ success: true })
}

const deleteDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    //Get a deck
    const deck = await Deck.findById(deckID)
    const ownerID = deck.owner

    //Get a user
    const owner = await User.findById(ownerID)

    //Remove deck

    await deck.deleteOne()

    //Remove deck from 
    owner.decks.pull(deck)
    await owner.save()

    return res.status(200).json({ success: true })
}

module.exports = {
    getDeck,
    getAllDeck,
    newDeck,
    replaceDeck,
    updateDeck,
    deleteDeck
}