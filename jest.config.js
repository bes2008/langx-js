module.exports= {
    "automock": false,
    "browser": true,
    "bail": true,
    "cacheDirectory": "<rootDir>/src/test/result/cache",
    "collectCoverage": true,
    "collectCoverageFrom": ["<rootDir>/src/main"],
    "coverageDirectory": "<rootDir>/src/test/result/coverage",
    "coverageReporters": ["json"],
    "moduleFileExtensions": ["js", "jsx", "json", "ts", "tsx"],
    "notify": true,
    "clearMocks": true,
    "roots":["<rootDir>/src/test/ts/"],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    }
};