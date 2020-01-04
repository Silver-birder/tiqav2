import {ISearchGateway} from '../gateways/iSearchGateway';
import {IUseCase} from '../../1_enterprise_business_rules/use_cases/iUseCase';
import {inject, injectable} from 'inversify';
import {TYPES} from '../../types';
import {IInputPort} from '../../1_enterprise_business_rules/use_cases/port/iInputPort';
import {IOutputPort} from '../../1_enterprise_business_rules/use_cases/port/iOutputPort';
import {IPresenter} from '../../1_enterprise_business_rules/presenters/iPresenter';
import {IPortFormat} from '../../1_enterprise_business_rules/use_cases/port/iPort';
import {TagsInputPortFormat} from './port/input/TagsInputPortImpl';
import {TagsSettableOutputPortFormat, TagsOutputPortImpl} from './port/output/TagsOutputPortImpl';


@injectable()
export class SearchTagsInteractorImpl implements IUseCase {
    private searchGateWay: ISearchGateway;
    presenter: IPresenter;

    constructor(
        @inject(TYPES.SearchGateway) searchGateWay: ISearchGateway,
        @inject(TYPES.TagsPresenter) presenter: IPresenter,
    ) {
        this.searchGateWay = searchGateWay;
        this.presenter = presenter;
    }

    async invoke(inputPort: IInputPort<TagsInputPortFormat>): Promise<void> {
        const input: TagsInputPortFormat = inputPort.get();
        const tags: Array<string> = await this.searchGateWay.tags(input.id, input.keyword);
        const outPutPort: IOutputPort<IPortFormat> = new TagsOutputPortImpl();
        const settable: TagsSettableOutputPortFormat = {
            tags: tags,
        };
        outPutPort.set(settable);
        this.presenter.render(outPutPort);
        return;
    }
}