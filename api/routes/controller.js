const express = require('express')
const sql = require('mssql')
const bodyParser = require('body-parser')
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const cpFile = require('cp-file');
const mkdirp = require('mkdirp')


// connection
const config = require('./config/db.config.js')
const GroupOfCompanies = require('./config/db.GroupOfCompanies.js')
const GroupOfJapAdvisers = require('./config/db.GroupOfJapAdvisers.js')


const cors = require('cors')
const router = express.Router();
const moment = require('moment')
const { query, request } = require('express')

router.use(cors())

// router.use(bodyParser.json({ limit: '200mb' }))
// router.use(bodyParser.urlencoded({ limit: '200mb', extended: true }))

// router.use(bodyParser.json({ limit: '200mb' }))

// router.use(express.json({ limit: '500mb' }));

// router.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 5000000000 }));


//==================== MASTER MAINTENANCE =====================//

//==================== User Maintenance =====================//

router.get('/getSafetyUsers/:CompanyCode', (req, res) => {
    let sqlQuery = `Select          EmployeeID,
                                    CompanyCode,
                                    DepartmentCode,
                                    EmployeeName,
                                    Password,
                                    UserLevel,
                                    Convert(varchar,DeletedDate,111) AS DeletedDate,
                    CASE	WHEN 	UserLevel = 0 
                    THEN			'User'
                    ELSE			'Admin'
                    END		AS		UserLevels,
                    CASE 	WHEN	DeletedDate IS NOT NULL
                    THEN			'Not Active'
                    ELSE			'Active'
                    END		AS		DeleteStatus
                    FROM        	SUPPORTSQL1.SafetyInvestigatoryDatabank.dbo.SafetyUsers
                    WHERE       	CompanyCode = '${req.params.CompanyCode}'
                    ORDER   BY    	UserLevel DESC`
    sql.connect(config, (error) => {
        if (!error) {
            let request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!error) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deleteUser', (req, res) => {
    let Data = req.body
    let sqlQuery = ` UPDATE      SafetyUsers
                    SET         DeletedDate = GETDATE()
                    WHERE       EmployeeID = '${Data.EmployeeID}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/permanentDelete', (req, res) => {
    let Data = req.body
    let sqlQuery = ` DELETE  FROM    SafetyUsers
                    WHERE           EmployeeID = '${Data.EmployeeID}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addUser', (req, res) => {
    let Data = req.body
    let sqlQuery = `INSERT  INTO    SafetyUsers
                    (
                        EmployeeID,
                        CompanyCode,
                        DepartmentCode,
                        UserLevel,
                        EmployeeName,
                        Password,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                    )
                    Values
                    (
                        '${Data.EmployeeID}',
                        '${Data.CompanyCode}',
                        '${Data.DepartmentCode}',
                        ${Data.UserLevel},
                        '${Data.EmployeeName}',
                        '${Data.Password}',
                        GETDATE(),
                        GETDATE(),
                        '${Data.UpdatedBy}'
                    )`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updateUser', (req, res) => {
    let Data = req.body
    let sqlQuery = ` UPDATE      SafetyUsers
                    SET         UserLevel = ${Data.UserLevel},
                                Password = '${Data.Password}',
                                UpdatedBy = '${Data.UpdatedBy}',
                                UpdatedDate = GETDATE()
                    WHERE       EmployeeID = '${Data.EmployeeID}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activateUser', (req, res) => {
    let Data = req.body
    let sqlQuery = ` UPDATE      SafetyUsers
                    SET         DeletedDate = NULL
                    WHERE       EmployeeID = '${Data.EmployeeID}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

//==================== Classification =====================//

router.get('/getclassificationsNULL', function (req, res) {

    let sqlQuery = `Select      ClassificationID,
                                ClassificationName, 
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM        SUPPORTSQL1.SafetyInvestigatoryDatabank.dbo.Classifications`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updateclassification', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    Classifications	
                        SET	        ClassificationName = '${Data.ClassificationName}'
                        WHERE	    ClassificationID = ${Data.ClassificationID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deleteclassification', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    Classifications	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    ClassificationID = ${Data.ClassificationID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addclassification', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO Classifications	
                        (
                        ClassificationID,
                        ClassificationName,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.ClassificationID},
                        '${Data.ClassificationName}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        )`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activateclassification', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    Classifications	
                        SET	        DeletedDate = NULL
                        WHERE	    ClassificationID = ${Data.ClassificationID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

//==================== Extent of Injury =====================//

router.get('/getextentofinjuryNULL', function (req, res) {

    let sqlQuery = `Select      ExtentInjuryID,
                                ExtentOfInjuries, 
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM        SUPPORTSQL1.SafetyInvestigatoryDatabank.dbo.ExtentOfInjuries`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updateextentofinjury', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    ExtentOfInjuries	
                        SET	        ExtentOfInjuries = '${Data.ExtentOfInjuries}'
                        WHERE	    ExtentInjuryID = ${Data.ExtentInjuryID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deleteextentofinjury', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    ExtentOfInjuries	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    ExtentInjuryID = ${Data.ExtentInjuryID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addextentofinjury', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO ExtentOfInjuries	
                        (
                        ExtentInjuryID,
                        ExtentOfInjuries,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.ExtentInjuryID},
                        '${Data.ExtentOfInjuries}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        )`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activeextentofinjury', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    ExtentOfInjuries     	
                        SET	        DeletedDate = NULL
                        WHERE	    ExtentInjuryID = ${Data.ExtentInjuryID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

//==================== Injury Level =====================//

router.get('/getinjurylevelNULL', function (req, res) {

    let sqlQuery = `SELECT      InjuryID,
                                InjuryLevel,
                                InjuryLevelDescription,
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM           InjuryLevels`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updateinjurylevel', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE      InjuryLevels
                        SET         InjuryLevel = '${Data.InjuryLevel}'
                        WHERE       InjuryID = ${Data.InjuryID} `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deleteinjurylevel', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    InjuryLevels	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    InjuryID = ${Data.InjuryID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addinjurylevel', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO InjuryLevels	
                        (
                        InjuryID,
                        InjuryLevel,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.InjuryID},
                        '${Data.InjuryLevel}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        )`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activeinjurylevel', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    InjuryLevels	
                        SET	        DeletedDate = NULL
                        WHERE	    InjuryID = ${Data.InjuryID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

//==================== Parts Injured =====================//

router.get('/getpartsinjuredNULL', function (req, res) {

    let sqlQuery = `SELECT      PartsInjuredID,
                                PartsInjuredName,
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM        PartsInjured`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updatepartsinjured', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE      PartsInjured
                        SET         PartsInjuredName = '${Data.PartsInjuredName}'
                        WHERE       PartsInjuredID = ${Data.PartsInjuredID} `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deletepartsinjured', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    PartsInjured	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    PartsInjuredID = ${Data.PartsInjuredID}`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addinpartsinjured', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO PartsInjured	
                        (
                        PartsInjuredID,
                        PartsInjuredName,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.PartsInjuredID},
                        '${Data.PartsInjuredName}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        )`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activepartsinjured', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    PartsInjured	
                        SET	        DeletedDate = NULL
                        WHERE	    PartsInjuredID = ${Data.PartsInjuredID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

//==================== Property Damaged =====================//

router.get('/getpropertydamagedNULL', function (req, res) {

    let sqlQuery = `SELECT      PropertyDamagedID,
                                PropertyDamaged,
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM        PropertyDamaged`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updatepropertydamaged', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE      PropertyDamaged
                        SET         PropertyDamaged = '${Data.PropertyDamaged}'
                        WHERE       PropertyDamagedID = ${Data.PropertyDamagedID} `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deletpropertydamaged', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    PropertyDamaged	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    PropertyDamagedID = ${Data.PropertyDamagedID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addpropertydamaged', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO PropertyDamaged	
                        (
                        PropertyDamagedID,
                        PropertyDamaged,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.PropertyDamagedID},
                        '${Data.PropertyDamaged}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        ) 
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activepropertydamaged', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    PropertyDamaged	
                        SET	        DeletedDate = NULL
                        WHERE	    PropertyDamagedID = ${Data.PropertyDamagedID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


//==================== Extent of Damaged =====================//

router.get('/getextentofdamagedNULL', function (req, res) {

    let sqlQuery = `SELECT      DamagedID,
                                ExtentofDamaged,
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM        ExtentofDamaged`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updateextentofdamage', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE      ExtentofDamaged
                        SET         ExtentofDamaged = '${Data.ExtentofDamaged}'
                        WHERE       DamagedID = ${Data.DamagedID} `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deleteextentofdamaged', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    ExtentofDamaged	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    DamagedID = ${Data.DamagedID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addextentofdamaged', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO ExtentofDamaged	
                        (
                        DamagedID,
                        ExtentofDamaged,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.DamagedID},
                        '${Data.ExtentofDamaged}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        ) 
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activeextentofdamaged', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    ExtentofDamaged	
                        SET	        DeletedDate = NULL
                        WHERE	    DamagedID = ${Data.DamagedID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


//==================== Primary TME =====================//

router.get('/getprimarytmeNULL', function (req, res) {

    let sqlQuery = `SELECT      PrimaryTMEID,
                                PrimaryTME,
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM        PrimaryTME`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updateprimarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE      PrimaryTME
                        SET         PrimaryTME = '${Data.PrimaryTME}'
                        WHERE       PrimaryTMEID = ${Data.PrimaryTMEID} `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deleteprimarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    PrimaryTME	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    PrimaryTMEID = ${Data.PrimaryTMEID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addprimarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO PrimaryTME	
                        (
                        PrimaryTMEID,
                        PrimaryTME,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.PrimaryTMEID},
                        '${Data.PrimaryTME}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        ) 
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activeprimarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    PrimaryTME	
                        SET	        DeletedDate = NULL
                        WHERE	    PrimaryTMEID = ${Data.PrimaryTMEID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

//==================== Secondary TME =====================//

router.get('/getsecondarytmeNULL', function (req, res) {

    let sqlQuery = `SELECT      SecondaryTMEID,
                                SecondaryTME,
                                CONVERT(varchar,DeletedDate,111) AS DeletedDate 
                    FROM        SecondaryTME`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/updatesecondarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE      SecondaryTME
                        SET         SecondaryTME = '${Data.SecondaryTME}'
                        WHERE       SecondaryTMEID = ${Data.SecondaryTMEID} `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deletesecondarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    SecondaryTME	
                        SET	        DeletedDate = GETDATE()
                        WHERE	    SecondaryTMEID = ${Data.SecondaryTMEID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/addsecondarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     INSERT INTO SecondaryTME	
                        (
                        SecondaryTMEID,
                        SecondaryTME,
                        CreatedDate,
                        UpdatedDate,
                        UpdatedBy
                        )
                        VALUES	    
                        (
                        ${Data.SecondaryTMEID},
                        '${Data.SecondaryTME}',
                        '${Data.CreatedDate}',
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}'
                        ) 
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/activesecondarytme', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    SecondaryTME	
                        SET	        DeletedDate = NULL
                        WHERE	    SecondaryTMEID = ${Data.SecondaryTMEID}
                                        `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

//==================== Login =====================//

router.get('/LogInSelect/:user', function (req, res) {

    let sqlQuery = ` EXECUTE dbo.CheckLogIn @EmployeeID = '${req.params.user}' `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


//==================== Dashboard =====================//

router.get('/DashBoardHeader/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.DashBoardHeader @CompanyCode  = '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset[0]);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/DashBoardHeaderAll/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.DashBoardHeaderAll @CompanyCode  = '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset[0]);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.get('/GetTopData/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.GetTopData @CompanyCode = '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/GetTopDataOverall/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.GetTopDataOverall @CompanyCode = '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.get('/GetTop1/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.GetTop1 @CompanyCode = '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


//==================== Record Tab =====================//

router.get('/getTableData/:CompanyCode/:DateHappened', function (req, res) {

    let sqlQuery = `EXECUTE dbo.TableItems @CompanyCode =  '${req.params.CompanyCode}', @DateHappened = '${req.params.DateHappened}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})
router.get('/getTableData2/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.TableItems2 @CompanyCode =  '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.get('/getaccidentdegree', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcAccidentDegree`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.get('/getTypeOfReports', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcTypeofReport`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.get('/getyear/:CompanyCode', function (req, res) {

    let sqlQuery = `SELECT  DISTINCT YEAR(DateHappened) AS Year
                    FROM    SafetyRecords 
                    WHERE   CompanyCode = '${req.params.CompanyCode}' 
                    ORDER   BY YEAR(DateHappened) DESC`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})



// =====================================================================
// ======================Add Record Functions===========================
// =====================================================================   


router.get('/getcompany', function (req, res) {

    let sqlQuery = `EXECUTE dbo.Companylist`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.get('/getinjurylevel', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcInjuryLevel`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getextentofinjury', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcExtentInjury`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getpartsinjured', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcPartsInjured`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getpropertydamage', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcPropertyDamaged`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getextentdamage', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcExtentofDamaged`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})



router.get('/getsecondarytme', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcSecondaryTME`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.get('/getprimetme', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcPrimeTME`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getcivilstatus', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcCivilStatus`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getseqno/:DateHappened/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcSequenceID @DateHappened = '${req.params.DateHappened}', @CompanyCode = '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getJapAdvisers/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcJapAdviser`
    sql.connect(GroupOfJapAdvisers, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getgrpofcompanyemployees/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.GroupCompanyEmployees `
    sql.connect(GroupOfCompanies, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getcrrviolation', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcCRRViolation`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.get('/getworkshift/:CompanyCode', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcWorkShift @CompanyCode = '${req.params.CompanyCode}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})



router.get('/getclassification', function (req, res) {

    let sqlQuery = `EXECUTE dbo.ProcClassification`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.post('/addnewrecord', function (req, res) {
    let Data = req.body
    // console.log(Data)

    let sqlQuery = `
                    INSERT INTO dbo.SafetyRecords	
                    (
                        SeqID,
                        SirNo,
                        CompanyCode,
                        EmployeeID,
                        Department,
                        Section,
                        CRRID,
                        InjuryLevelID,
                        DegreeofAccidentID,
                        ReportID,
                        ClassificationID,
                        PartsInjuredID,
                        ExtentofDamagedID,
                        PropertyDamagedID,
                        PartsTME,
                        PrimaryTMEID,
                        SecondaryTMEID,
                        ExtentofInjuryID,
                        CivilStausID,
                        ShiftID,
                        DeparmentHead,
                        DepartmentAdviser,
                        ImmediateSuperior,
                        NewsFlashTitle,
                        Details,
                        DaysLost,
                        DateHappened,
                        TimeHappened,
                        NatureOfInjury,
                        SpecificParts,
                        ImmediateActionTaken,
                        FurtherInvestigation,
                        RootCauseAnalysis,
                        PictureCause,
                        PictureEffect,
                        Witness1,
                        Witness2,
                        PlaceofIncident,
                        DamagedCost,
                        DamageCharged,
                        CorrectiveAction,
                        ImplementationDate,
                        LengthofService,
                        LengthofExposure,
                        FinalReviewingAuthority,
                        ApprovingAuthority,
                        UnsafeAction,
                        UnsafeCondition,
                        Conclusion,
                        InvestigatedBy,
                        SafetyTeamLeader,
                        FSQDepartmentHead,
                        FSQDepartmentAdviser,
                        EmployeeAge,
                        CreatedDate,
                        DeletedDate,
                        UpdatedDate,
                        UpdatedBy,
                        Active
                    )
                    VALUES 	
                    (
                        ${Data.SeqID},
                        '${Data.SirNo}',
                        '${Data.CompanyCode}',
                        '${Data.EmployeeID}',
                        '${Data.Department}',
                        '${Data.Section}',
                        '${Data.CRRID}',
                        ${Data.InjuryLevelID},
                        ${Data.DegreeofAccidentID},
                        ${Data.ReportID},
                        ${Data.ClassificationID},
                        ${Data.PartsInjuredID},
                        ${Data.ExtentofDamagedID},
                        ${Data.PropertyDamagedID},
                        '${Data.PartsTME}',
                        ${Data.PrimaryTMEID},
                        ${Data.SecondaryTMEID},
                        ${Data.ExtentofInjuryID},
                        ${Data.CivilStausID},
                        ${Data.ShiftID},
                        '${Data.DeparmentHead}',
                        '${Data.DepartmentAdviser}',
                        '${Data.ImmediateSuperior}',
                        '${Data.NewsFlashTitle}',
                        '${Data.Details}',
                        '${Data.DaysLost}',
                        '${Data.DateHappened}',
                        '${Data.TimeHappened}',
                        '${Data.NatureOfInjury}',
                        '${Data.SpecificParts}',
                        '${Data.ImmediateActionTaken}',
                        '${Data.FurtherInvestigation}',
                        '${Data.RootCauseAnalysis}',
                        '${Data.PictureCause}',
                        '${Data.PictureEffect}',
                        '${Data.Witness1}',
                        '${Data.Witness2}',
                        '${Data.PlaceofIncident}',
                        ${Data.DamagedCost},
                        ${Data.DamageCharged},
                        '${Data.CorrectiveAction}',
                        NULL,
                        '${Data.LengthofService}',
                        '${Data.LengthofExposure}',
                        NULL,
                        NULL,
                        '${Data.UnsafeAction}',
                        '${Data.UnsafeCondition}',
                        '${Data.Conclusion}',
                        '${Data.InvestigatedBy}',
                        '${Data.SafetyTeamLeader}',
                        '${Data.FSQDepartmentHead}',
                        '${Data.FSQDepartmentAdviser}',
                        ${Data.EmployeeAge},
                        '${Data.CreatedDate}',
                        NULL,
                        '${Data.UpdatedDate}',
                        '${Data.UpdatedBy}',
                        1
                    )`

    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    console.log('Save')
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


// =====================================================================
// ======================Updated Record=================================
// =====================================================================


router.post('/updatesafetyrecords', (req, res) => {
    let Data = req.body
    let sqlQuery = `     UPDATE	    SafetyRecords	
                            SET	        SeqID = ${Data.SeqID},
                                        SirNo = '${Data.SirNo}',
                                        EmployeeID = '${Data.EmployeeID}',
                                        Department = '${Data.Department}',
                                        Section = '${Data.Section}',
                                        CRRID = '${Data.CRRID}',
                                        ShiftID = '${Data.ShiftID}',
                                        InjuryLevelID = ${Data.InjuryLevelID},
                                        DegreeofAccidentID = ${Data.DegreeofAccidentID},
                                        ReportID = ${Data.ReportID},
                                        ClassificationID = ${Data.ClassificationID},
                                        PartsInjuredID = ${Data.PartsInjuredID},
                                        ExtentofDamagedID = ${Data.ExtentofDamagedID},
                                        PropertyDamagedID = ${Data.PropertyDamagedID},
                                        PartsTME = '${Data.PartsTME}',
                                        PrimaryTMEID = ${Data.PrimaryTMEID},
                                        SecondaryTMEID = ${Data.SecondaryTMEID},
                                        ExtentofInjuryID = ${Data.ExtentofInjuryID},
                                        CivilStausID = ${Data.CivilStausID} ,
                                        LengthofExposure = '${Data.LengthofExposure}' ,
                                        DeparmentHead = '${Data.DepartmentHeadCode}',
                                        DepartmentAdviser= '${Data.DepartmentAdviserCode}',
                                        ImmediateSuperior = '${Data.ImmediateSuperiorCode}',
                                        NewsFlashTitle = '${Data.NewsFlashTitle}',
                                        Details = '${Data.Details}',
                                        DaysLost = '${Data.DaysLost}',
                                        DateHappened = '${Data.DateHappened}',
                                        TimeHappened = '${Data.TimeHappened}',
                                        NatureOfInjury = '${Data.NatureOfInjury}',
                                        SpecificParts = '${Data.SpecificParts}',
                                        ImmediateActionTaken = '${Data.ImmediateActionTaken}',
                                        FurtherInvestigation = '${Data.FurtherInvestigation}',
                                        RootCauseAnalysis = '${Data.RootCauseAnalysis}',
                                        PictureCause = '${Data.PictureCause}',
                                        PictureEffect = '${Data.PictureEffect}',
                                        Witness1 = '${Data.Witness1}',
                                        Witness2 = '${Data.Witness2}',
                                        PlaceofIncident = '${Data.PlaceofIncident}',
                                        DamagedCost = ${Data.DamagedCost},
                                        DamageCharged = ${Data.DamageCharged},
                                        CorrectiveAction = '${Data.CorrectiveAction}',
                                        LengthofService = '${Data.LengthofService}',
                                        UnsafeAction = '${Data.UnsafeAction}',
                                        UnsafeCondition = '${Data.UnsafeCondition}',
                                        Conclusion = '${Data.Conclusion}',
                                        InvestigatedBy = '${Data.InvestigatedBy}',
                                        SafetyTeamLeader = '${Data.SafetyTeamLeader}',
                                        FSQDepartmentHead = '${Data.FSQDepartmentHead}',
                                        FSQDepartmentAdviser = '${Data.FSQDepartmentAdviser}',
                                        EmployeeAge = ${Data.EmployeeAge},
                                        UpdatedDate = '${Data.UpdatedDate}',
                                        UpdatedBy = '${Data.UpdatedBy}'
                                        WHERE	    SirNo = '${Data.oldSIRNo}'
                                        `
    // console.log(sqlQuery)

    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        }
        else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.post('/lock', function (req, res) {
    let Data = req.body
    let sqlQuery = `
            UPDATE      SafetyRecords
            SET         Active = 0
            WHERE       SirNo = '${Data.SirNo}'
            `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.post('/unlock', function (req, res) {
    let Data = req.body
    let sqlQuery = `
            UPDATE      SafetyRecords
            SET         Active = 1
            WHERE       SirNo = '${Data.SirNo}'
            `
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.post('/deleteemployee', function (req, res) {
    let Data = req.body
    let sqlQuery = `
            UPDATE	    SafetyRecords
            SET         DeletedDate = getdate()
            WHERE       SirNo = '${Data.SirNo}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

router.post('/deleterecord', function (req, res) {
    let Data = req.body
    let sqlQuery = ` DELETE  FROM    SafetyRecords
    WHERE           SirNo = '${Data.SirNo}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})


router.post('/reuserecord', function (req, res) {
    let Data = req.body
    let sqlQuery = `
            UPDATE	    SafetyRecords
            SET         DeletedDate = NULL
            WHERE       SirNo = '${Data.SirNo}'`
    sql.connect(config, function (error) {
        if (!error) {
            var request = new sql.Request();
            request.query(sqlQuery, (err, data) => {
                if (!err) {
                    res.send(data.recordset);
                } else {
                    console.log(err)
                    res.json({ message: err })
                }
            })
        } else {
            console.log(error)
            res.json({ message: error })
        }
    })
})

// =====================================================================
// ======================File Upload Multer=============================
// =====================================================================

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = `//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank/${req.headers.path}/${req.headers.sirno}`
        console.log(dir)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        console.log(req.headers)
        cb(null, `${req.headers.sirno}-${req.headers.type}.png`)
    }
})


let upload = multer({ storage: storage });

router.post('/uploadSingleFile', upload.array("files"), (req, res) => {
    res.send('ok')
    console.log(req.files)
})



router.post('/makeDirectory/:CompanyPath/:SirNo', (req, res) => {
    let dir = `//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank/${req.params.CompanyPath}/${req.params.SirNo}`
    if (!fs.existsSync(dir)) {
        const made = mkdirp.sync(dir)
        console.log(`made directories, starting with ${made}`)
    }
})

router.post('/deleteDirectory/:CompanyPath/:SirNo', (req, res) => {
    let dir = `//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank/${req.params.CompanyPath}/${req.params.SirNo}`
    fs.rmdirSync(dir, { recursive: true });

    console.log(`${dir} is deleted!`);

})

router.post('/CopyFile', (req, res) => {
    let Data = req.body
    console.log(Data)
    cpFile(`${Data.image}`, `//hv12-hrd41/D/Deployment/SafetyInvestigatoryDatabank/${Data.CompanyPath}/${Data.SirNo}/${Data.filename}`);
    console.log('File copied');

})

router.get('/', (req, res) => {
    res.send('Your Fist Application GOODLUCK!')
})

module.exports = router;




