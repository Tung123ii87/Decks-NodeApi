const express = require('express')
const router = require('express-promise-router')()

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

const DeckController = require('../controller/deck')

router.route('/')
    .get(DeckController.getAllDeck)
    .post(validateBody(schemas.newDeckSchema), DeckController.newDeck)

router.route('/:deckID')
    .get(validateParam(schemas.idSchema, 'deckID'), DeckController.getDeck)
    .put(validateParam(schemas.idSchema, 'deckID'), validateBody(schemas.newDeckSchema), DeckController.replaceDeck)
    .patch(validateParam(schemas.idSchema, 'deckID'), validateBody(schemas.deckOptionalschema), DeckController.updateDeck)
    .delete(validateParam(schemas.idSchema, 'deckID'), DeckController.deleteDeck)
module.exports = router