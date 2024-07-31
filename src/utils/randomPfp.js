export const pfpSourceLinkBeam = "https://api.boringavatars.dev/api/avatar?variant=beam";
export const pfpSourceLinkBeamMarble = "https://api.boringavatars.dev/api/avatar?variant=marble";
export const pfpSourceLinkEmoji = "https://api.dicebear.com/8.x/fun-emoji/svg/";

export const generatePfp = (pfpType) => {


    const getBaseUrl = (pfpType) => {
        switch (pfpType) {
            case "marble":
                return pfpSourceLinkBeamMarble
            case "beam":
                return pfpSourceLinkBeam
            default:
                return pfpSourceLinkEmoji
        }
    }

    return getBaseUrl(pfpType);
}

export const generatePfpUrls = (numOfUrls, type) => {
    const urlArray = [];

    while (urlArray.length <= numOfUrls) {
        const generatedPfpUrl = generatePfp(type);
        urlArray.push(generatedPfpUrl);
    }

    let currentUrlIndex = 0;

    return {
        getUrl: () => {
            if (currentUrlIndex < numOfUrls) {
                currentUrlIndex++;
                return urlArray[currentUrlIndex - 1];
            } else return urlArray[Math.random() * numOfUrls]
        },
        getAllUrls: () => urlArray
    }
}