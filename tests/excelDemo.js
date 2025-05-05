const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const fs = require('fs');

// Helper function to read data from an Excel file
function readExcel(filePath, sheetName) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

// Helper function to write data to an Excel file
function writeExcel(filePath, sheetName, data) {
    const workbook = fs.existsSync(filePath) ? xlsx.readFile(filePath) : xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    xlsx.writeFile(workbook, filePath);
}

// Helper function to update a specific cell in an Excel file
function updateExcelCell(filePath, sheetName, rowIndex, colKey, newValue) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    if (data[rowIndex]) {
        data[rowIndex][colKey] = newValue;
        writeExcel(filePath, sheetName, data);
    }
}

// Playwright test to validate Excel operations
test.describe('Excel Operations Validation', () => {
    const excelFilePath = './testData.xlsx';
    const sheetName = 'Sheet1';

    test.beforeAll(() => {
        // Create initial Excel file for testing
        const initialData = [
            { Name: 'Alice', Age: 25, City: 'New York' },
            { Name: 'Bob', Age: 30, City: 'Los Angeles' },
        ];
        writeExcel(excelFilePath, sheetName, initialData);
    });

    test('Read data from Excel file', async () => {
        const data = readExcel(excelFilePath, sheetName);
        expect(data).toEqual([
            { Name: 'Alice', Age: 25, City: 'New York' },
            { Name: 'Bob', Age: 30, City: 'Los Angeles' },
        ]);
    });

    test('Write data to Excel file', async () => {
        const newData = [
            { Name: 'Charlie', Age: 35, City: 'Chicago' },
            { Name: 'Diana', Age: 28, City: 'Houston' },
        ];
        writeExcel(excelFilePath, sheetName, newData);

        const data = readExcel(excelFilePath, sheetName);
        expect(data).toEqual(newData);
    });

    test('Update a specific cell in Excel file', async () => {
        updateExcelCell(excelFilePath, sheetName, 0, 'City', 'San Francisco');

        const data = readExcel(excelFilePath, sheetName);
        expect(data[0].City).toBe('San Francisco');
    });

    test.afterAll(() => {
        // Clean up the test Excel file
        if (fs.existsSync(excelFilePath)) {
            fs.unlinkSync(excelFilePath);
        }
    });
});