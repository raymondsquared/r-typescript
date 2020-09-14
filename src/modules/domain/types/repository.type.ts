/* eslint-disable no-unused-vars */
import { Domain } from './domain.type';
import { Output } from '../../common/types/output.type';

interface DomainRepository {
  readOneDomain(domainID: string): Promise<Output<Domain>>;
}

export { DomainRepository };
