import {IInputPort, IInputPortFormat} from '@src/1_enterprise_business_rules/use_cases/port/iInputPort';

import {IRequest} from '@src/2_application_business_rules/controllers/iController';

export interface ImageInputPortFormat extends IInputPortFormat {
    url: string;
    id: number;
    tags: Array<string>;
    quote: string;
    extension: string;
    savedImage: boolean;
}


export class ImageInputPortImpl implements IInputPort<IInputPortFormat> {
    private _data: ImageInputPortFormat = {url: '', id: 0, tags: [], quote: '', extension: '', savedImage: false};

    set(request: IRequest) {
        this._data.id = request.id;
        this._data.url = request.url;
        this._data.tags = request.tags;
        this._data.quote = request.quote;
        this._data.extension = request.extension;
        this._data.savedImage = request.savedImage;
    }

    get(): ImageInputPortFormat {
        return this._data;
    }
}