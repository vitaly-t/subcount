import chai from 'chai';
import {describe} from 'mocha';
import spies from 'chai-spies';

chai.use(spies);

const expect = chai.expect;
const should = chai.should();

export {describe, expect, should, chai};
