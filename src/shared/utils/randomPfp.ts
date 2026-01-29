export const pfpSourceLinkBeam = "https://api.boringavatars.dev/api/avatar?variant=beam";
export const pfpSourceLinkBeamMarble = "https://api.boringavatars.dev/api/avatar?variant=marble";
export const pfpSourceLinkEmoji = "https://api.dicebear.com/8.x/fun-emoji/svg/";

/**
 * Defines the types of profile picture variants available.
 * 
 * @typedef {'marble' | 'beam'} pfpType
 */
type PfpType = 'marble' | 'beam';

/**
 * Generates the base URL for a profile picture based on the specified variant type.
 *
 * This function takes a profile picture type and returns the corresponding base URL.
 *
 * @param {PfpType} pfpType - The type of profile picture variant to generate the URL for.
 * @returns {string} - The base URL for the specified profile picture variant.
 */
export const generatePfp = (pfpType: PfpType) => {
    const getBaseUrl = (pfpType: PfpType) => {
        switch (pfpType) {
            case "marble":
                return pfpSourceLinkBeamMarble;
            case "beam":
                return pfpSourceLinkBeam;
            default:
                return pfpSourceLinkEmoji;
        }
    }

    return getBaseUrl(pfpType);
}

/**
 * Generates a specified number of profile picture URLs of a given type.
 *
 * This function creates an array of profile picture URLs based on the provided type
 * and the number of URLs requested. It also provides methods to retrieve a specific URL
 * or all generated URLs.
 *
 * @param {number} numOfUrls - The number of profile picture URLs to generate.
 * @param {PfpType} type - The type of profile picture variant for the URLs.
 * @returns {Object} - An object containing methods to get a random URL or all generated URLs.
 */
export const generatePfpUrls = (numOfUrls: number, type: PfpType) => {
    const urlArray: Array<string> = [];

    while (urlArray.length < numOfUrls) {
        const generatedPfpUrl = generatePfp(type);
        urlArray.push(generatedPfpUrl);
    }

    let currentUrlIndex = 0;

    return {
        /**
         * Retrieves the next URL in the sequence or a random URL if all have been accessed.
         *
         * @returns {string} - The next profile picture URL or a random one if all have been used.
         */
        getUrl: () => {
            if (currentUrlIndex < numOfUrls) {
                currentUrlIndex++;
                return urlArray[currentUrlIndex - 1];
            } else {
                return urlArray[Math.floor(Math.random() * numOfUrls)];
            }
        },

        /**
         * Retrieves all generated profile picture URLs.
         *
         * @returns {Array<string>} - The array of all generated profile picture URLs.
         */
        getAllUrls: () => urlArray
    }
}