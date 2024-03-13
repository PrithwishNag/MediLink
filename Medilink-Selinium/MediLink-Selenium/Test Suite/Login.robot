*** Settings ***
Documentation     A test suite for valid login.
...
...               Keywords are imported from the resource file
Resource          ../Keywords/Commonkeywords.robot

Default Tags      MediLink

Suite Setup    Launch Browser
Suite Teardown    Close Test

*** Test Cases ***
Login User with Password
    [Documentation]    To check valid Login
    Login User            gg.gg@gmail.com    admin@12345

Verify Patient Dashboard
    [Documentation]    Verify patient dashboard
#    Login User            gg.gg@gmail.com    admin@12345
    Verify patient dashboard
    Verify Patient details
   
Verify Medicine details
    [Documentation]    Verify the patient medicines
    #Login User            gg.gg@gmail.com    admin@12345
    Verify patient dashboard
    Verify Medication details

Verify Precautions
    [Documentation]    Verify Precaution for Patients
    Verify Precautions

Verify Past Medical records
    [Documentation]    Patient Past medical records
    Verify Past Medical Records

Verify Patient Graphs
    [Documentation]    Graphs for Patient
    Verify Graphs

Verify Patient Medical Claim
    [Documentation]    Patient medical claims
    Verify Medical Claims

Submit Patient Medical Claims
    [Documentation]    Patient submitted medical claim details
    Submit Claims

Patient pending Medical Claims
    [Documentation]    Patient pending medical claim details
    Pending Claims



    