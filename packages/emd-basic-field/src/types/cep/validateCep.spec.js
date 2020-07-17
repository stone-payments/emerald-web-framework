import { expect } from 'chai';
import { validateCep } from './validateCep.js';

describe('validateCep', () => {
  it('Should return undefined when receiving no arguments', () => {
    expect(validateCep()).to.be.undefined;
  });

  it('Should return undefined when receiving an empty string', () => {
    expect(validateCep('')).to.be.undefined;
  });

  it('Should return message when receiving invalid value', () => {
    expect(validateCep('123')).to.be.a('string');
  });

  it('Should return message when receiving a string with invalid length',
    () => {
      expect(validateCep('123')).to.be.a('string');
      expect(validateCep('123456789')).to.be.a('string');
    });

  it('Should return message when receiving an invalid string', () => {
    expect(validateCep('ABC45678')).to.be.a('string');
  });

  it('Should return undefined when receiving a valid string', () => {
    expect(validateCep('12345678')).to.be.undefined;
  });
});
