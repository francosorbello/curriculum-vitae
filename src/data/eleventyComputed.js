import strings from "../data/strings.json" with {type: "json"}

export default {
    getTranslatedCollection({ language, collections }) {
        if (language === undefined) {
            return "No language"
        }
        switch (language) {
            case "english":
                return collections.en
            case "spanish":
                return collections.es
            default:
                return "no collection"
        }
    },
    getTranslatedStrings({ language }) {
        if (language === undefined) {
            return {}
        }
        switch (language) {
            case "english":
                return strings.en
            case "spanish":
                return strings.es
            default:
                return {}
        }
    }
}