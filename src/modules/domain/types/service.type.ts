/* eslint-disable no-unused-vars */
import { Domain } from './domain.type';
import { Output } from '../../common/types/output.type';

interface DomainService {
  getOneDomain(domainID: string): Promise<Output<Domain>>;
}

export { DomainService };
