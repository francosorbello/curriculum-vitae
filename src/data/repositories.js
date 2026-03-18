import Cache from '@11ty/eleventy-cache-assets'
import lodash from 'lodash'

// if you want to display your most starred github repositories,
// change this to your username. if not, set it to false.
const YOUR_GITHUB_USERNAME = "francosorbello"
const LANGUAGES = ["Python", "GDScript", "Go"]

export default async function () {
    if (!YOUR_GITHUB_USERNAME) {
        return []
    }

    try {
        console.log('Fetching GitHub repos...')
        const repos = await Cache(
            `https://api.github.com/users/${YOUR_GITHUB_USERNAME}/repos?sort=updated`,
            {
                duration: "0s",
                type: "json",
            }
        )
        let filteredRepos = lodash.filter(repos,function(item) {
            const hasLanguage = LANGUAGES.includes(item.language) 
            return hasLanguage
        })
        filteredRepos.forEach(element => {
            element.name = element.name + ` (${element.topics})`
        });
        return filteredRepos
        // return lodash.orderBy(repos, 'updated_at', 'desc')
    } catch (e) {
        console.log('Failed fetching GitHub repos',e)
        return []
    }
}
