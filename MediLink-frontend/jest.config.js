// jest.config.js
module.exports = {
  // ... other Jest configuration
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest" // Transform JS/JSX files with babel-jest
  },
  testEnvironment: "jsdom"
};
