const URL: string = 'https://tiqav2.work';
const SEARCH_PATH: string = '/api/search.json/';
const RANDOM_PATH: string = '/api/search/random.json';
const SAVE_PATH: string = '/api/images.json';

interface IResponse {
    responseCode: number,
    parseError: boolean,
    body: Array<JSON>,
}

interface ISlackAttachment {
    color: string,
    author_name: string,
    author_link: string,
    author_icon: string,
    pretext: string,
    title: string,
    title_link: string,
    text: string,
    image_url: string,
    thumb_url: string,
    footer: string,
    ts: number,
    fields: Array<any>,
}

function doPost(e: any): any {
    const text: string = e.parameter.text;
    const splitText: Array<string> = text.split(/\s/);
    const command: string = splitText[0];
    let attachments: Array<ISlackAttachment> = [];
    switch (command) {
        case 'search':
            attachments = search(e.parameter.text);
            break;
        case 'save':
            attachments = save(e.parameter.text);
            break;
        case 'random':
            attachments = random();
            break;
    }
    const response: {} = {
        attachments: attachments
    };
    // @ts-ignore
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
};

const search = (text: string): Array<ISlackAttachment> => {
    const splitText: Array<string> = text.split(/\s/);
    const keyword: string = splitText[1];
    const params: any = {
        q: keyword,
    };
    const url: string = `${URL}${SEARCH_PATH}${_buildParams(params)}`;
    const response: IResponse = urlGetFetch(url);
    let attachments: Array<ISlackAttachment> = [];
    if (response.parseError || response.body.length == 0) {
        let attachment: ISlackAttachment = _initAttachment(url);
        attachment.pretext = `Search Keywords: ${params.q}`;
        attachment.text = 'Not Found';
        attachments.push(attachment);
    } else {
        response.body.forEach((j: any) => {
            let attachment: ISlackAttachment = _initAttachment(url);
            attachment.pretext = `Search Keywords: ${params.q}`;
            attachment = _successInputAttachment(attachment, j);
            attachments.push(attachment);
        });
    }
    return attachments;
};

const save = (text: string): Array<ISlackAttachment> => {
    const splitText: Array<string> = text.split(/\s/);
    const targetUrl: string = splitText[1];
    let params: any = {
        url: targetUrl,
        si: 1,
    };
    if(splitText.length === 3) {
        params.quote = splitText[2];
    }
    if(splitText.length === 4) {
        params.tags = splitText[3];
    }
    const url: string = `${URL}${SAVE_PATH}${_buildParams(params)}`;
    const response: IResponse = urlGetFetch(url);
    let attachments: Array<ISlackAttachment> = [];
    if (response.parseError || response.body.length == 0) {
        let attachment: ISlackAttachment = _initAttachment(url);
        attachment.pretext = `Save Target URL: ${params.url}`;
        attachment.text = 'Not Saved';
        attachments.push(attachment);
    } else {
        response.body.forEach((j: any) => {
            let attachment: ISlackAttachment = _initAttachment('');
            attachment.pretext = `Save Target URL: ${params.url}`;
            attachment = _successInputAttachment(attachment, j);
            attachments.push(attachment);
        });
    }
    return attachments;
};

const random = (): Array<ISlackAttachment> => {
    const url: string = `${URL}${RANDOM_PATH}`;
    const response: IResponse = urlGetFetch(url);
    let attachments: Array<ISlackAttachment> = [];
    if (response.parseError || response.body.length == 0) {
        let attachment: ISlackAttachment = _initAttachment(url);
        attachment.pretext = `Random:`;
        attachment.text = 'Not Found';
        attachments.push(attachment);
    } else {
        response.body.forEach((j: any) => {
            let attachment: ISlackAttachment = _initAttachment(url);
            attachment.pretext = `Random:`;
            attachment = _successInputAttachment(attachment, j);
            attachments.push(attachment);
        });
    }
    return attachments;
};

const _buildParams = (params: any): any => {
    let strParams: string = '?';
    Object.keys(params).forEach((key: string) => {
        strParams += `${key}=${params[key]}&`
    });
    return strParams.slice(0, -1);
};

const _initAttachment = (url: string): ISlackAttachment => {
    const now: Date = new Date();
    return {
        color: "danger",
        author_name: "silverbirder",
        author_link: "https://silver-birder.github.io/",
        author_icon: "https://pbs.twimg.com/profile_images/1075008669903814656/a8nmRE1o_reasonably_small.jpg",
        pretext: ``,
        title: "Tiqav2 API Response Results",
        title_link: url,
        text: '',
        image_url: '',
        thumb_url: '',
        footer: "Tiqav2 API",
        fields: [],
        ts: now.getTime()
    };
};

const _successInputAttachment = (attachment: ISlackAttachment, j: any): ISlackAttachment => {
    attachment.color = "good";
    attachment.text = j.quote;
    attachment.image_url = j.sourceURL;
    attachment.thumb_url = j.sourceURL;
    attachment.fields = [
        {
            title: "Tags",
            value: j.tags.join(),
        },
        {
            title: "Ext",
            value: j.ext.join(),
        },
        {
            title: "Link",
            value: `${URL}/api/${j.id}.${j.ext[0]}`,
        },
    ];
    return attachment;
};

const urlGetFetch = (url: string): IResponse => {
    const option: {} = {
        method: 'get',
        contentType: 'application/json; charset=utf-8',
    };
    // @ts-ignore
    const response = UrlFetchApp.fetch(`${url}`, option);
    try {
        return {
            responseCode: response.getResponseCode(),
            parseError: false,
            body: JSON.parse(response.getContentText())
        };
    } catch (e) {
        return {
            responseCode: response.getResponseCode(),
            parseError: true,
            body: JSON.parse("[]")
        };
    }
};