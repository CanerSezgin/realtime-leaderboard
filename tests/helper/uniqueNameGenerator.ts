import {
    uniqueNamesGenerator,
    adjectives,
    names,
    NumberDictionary,
} from "unique-names-generator"

export default () => uniqueNamesGenerator({
    dictionaries: [
        adjectives,
        names,
        NumberDictionary.generate({ min: 1, max: 99 }),
    ],
    length: 3,
    separator: '',
    style: 'capital'
});
