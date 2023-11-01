import { CSV } from './csv';
import { describe, it, expect } from 'bun:test';

describe('CSV', () => {

  const header = ['Name', 'Age', 'Email']
  const headersEncoded = header.map((h) => `"${h}"`).join(",") + "\r\n";


  describe('constructor', () => {
    it('should set the header and maxCol properties', () => {
      const csv = new CSV({ header });
      expect(csv.getHeader()).toEqual(['Name', 'Age', 'Email']);
      expect(csv.maxCol).toBe(3);
    });
  });

  describe('setHeader', () => {
    it('should update the header and maxCol properties', () => {
      const csv = new CSV({ header });
      csv.setHeader(['ID', 'Name', 'Email', 'Phone']);
      expect(csv.getHeader()).toEqual(['ID', 'Name', 'Email', 'Phone']);
      expect(csv.maxCol).toBe(4);
    });
  });

  describe('addSequentially', () => {
    it('should add values to the next row sequentially', () => {
      const csv = new CSV({ header });
      csv.addSequentially('John');
      csv.addSequentially(30);
      csv.addSequentially('john@example.com');
      expect(csv).toEqual([header, ['John', 30, 'john@example.com']]);
    });
  });

  describe('toString', () => {
    it('should return the CSV as a string with the specified separator', () => {
      const csv = new CSV({ header });
      csv.addSequentially('John');
      csv.addSequentially(30);
      csv.addSequentially('john@example.com');
      expect(csv.toString(',')).toBe(headersEncoded + '"John",30,"john@example.com"');
    });

    it('should not include the header if specified', () => {
      const csv = new CSV({ header });
      csv.addSequentially('John');
      csv.addSequentially(30);
      csv.addSequentially('john@example.com');
      expect(csv.toString(',', false)).toBe('"John",30,"john@example.com"');
    });
  });

  describe('toStringEncoded', () => {
    it('should return the CSV as a string with the specified separator and encoded values', () => {
      const csv = new CSV({ header });
      csv.addSequentially('John');
      csv.addSequentially(30);
      csv.addSequentially('john@example.com');
      const rules = [
        { from: /\./g, to: '\\\.' }, // escape dots
        { from: /@/g, to: '\\@' }, // escape @
      ];
      expect(csv.toStringEncoded(',', rules)).toBe(headersEncoded + '"John",30,"john\\@example\\.com"');
    });
  });

  // describe('readString', () => {
  //   it('should parse a CSV string and return a CSV object', () => {
  //     const csvString = 'Name,Age,Email\nJohn,30,john@example.com\nJane,25,jane@example.com\n';
  //     const csv = CSV.readString(csvString);
  //     expect(csv.getHeader()).toEqual(['Name', 'Age', 'Email']);
  //     expect(csv).toEqual([
  //       ['John', 30, 'john@example.com'],
  //       ['Jane', 25, 'jane@example.com'],
  //     ]);
  //   });
  // });
});
