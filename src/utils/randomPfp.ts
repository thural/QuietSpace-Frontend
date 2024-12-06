export const pfpSourceLinkBeam = "https://api.boringavatars.dev/api/avatar?variant=beam";
export const pfpSourceLinkBeamMarble = "https://api.boringavatars.dev/api/avatar?variant=marble";
export const pfpSourceLinkEmoji = "https://api.dicebear.com/8.x/fun-emoji/svg/";

type pfpType = 'marble' | 'beam';

export const generatePfp = (pfpType: pfpType) => {

    const getBaseUrl = (pfpType: pfpType) => {
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

export const generatePfpUrls = (numOfUrls: number, type: pfpType) => {
    const urlArray: Array<string> = [];

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