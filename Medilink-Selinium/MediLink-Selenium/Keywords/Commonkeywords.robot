*** Settings ***
Documentation     This is a resource file, that can contain variables and keywords.
...               Keywords defined here can be used where this Keywords.resource in loaded.

Library           SeleniumLibrary
Library           ChromeForTesting

*** Variables ***
${HOMEPAGE}     http://localhost:3000/
${BROWSER}      Chrome
${FilePath}     D:\\Projects\\Medilink-Selinium\\MediLink-Selenium\\Test Suite\\String to JSON data.pdf

*** Keywords ***
Launch Browser
    Open Browser    ${HOMEPAGE}     ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    0.5 seconds

Close Test
    Close All Browsers

Login User
    [Documentation]    For user Login
    [Arguments]    ${login}    ${password}
    Input Text      //input[@name='email']   ${login}    clear=True
    Input Password   //input[@name='password']   ${password}    clear=True
    Click Button     id:SignIn

Verify patient dashboard
    [Documentation]    Verify Patient Dashboard
    Wait Until Page Contains       Patient Dashboard

Verify Patient details
    [Documentation]    Verify Patient Details
    Click Element    id:Patient details

Verify Medication details
    [Documentation]    Medication details of Patient
    Click Element    id:Medication details
    Table Should Contain    id:MedicineTable    Paracetamol
    Table Should Contain    id:MedicineTable    Naxdom 500
    Table Should Contain    id:MedicineTable    Tryptomer 10

Verify Precautions
    [Documentation]    Patient Precautions
    Scroll Element Into View    id:Precautions
    Click Element    id:Precautions

Verify Past medical records
    [Documentation]    For past medical records
    Scroll Element Into View    id:Past Medical records
    Click Element    id:Past Medical records
    Choose File      id:uploadDocuments    ${FilePath}
#    Click Button     id:Submit

Verify Graphs
    [Documentation]    Graph Data of Patient
    Scroll Element Into View    id:Graphs
    Click Element    id:Graphs

Verify Medical Claims
    [Documentation]    Medical claims of Patient
    Scroll Element Into View    id:MedicalClaims
    Click Element    id:MedicalClaims

Submit Claims
    [Documentation]    Submit claims by Patient
    Scroll Element Into View    id:SubmitClaims
    Click Element    id:SubmitClaims

Pending Claims
    [Documentation]    Pending claims by Patient
    Scroll Element Into View    id:PendingClaim
    Click Element    id:PendingClaim