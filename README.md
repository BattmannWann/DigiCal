# SH23 Main Repository 

Welcome to the DigiCal repository. 

Below you will find sections outlining it's purpose, usage and other useful information.


## The AMS DigiCal - Online Calendar

This is a project developed by team project group SH23, a third year group of university students from the University of Glasgow. It is to be delivered to AMS, a scientific body apart of SUERC.

DigiCal is designed to improve efficiency in the AMS lab by allowing users to track samples, schedule runs, and manage lab maintenance all in one place. The need for this system arises from the challenge of manually tracking sample data, maintenance events, and staff attendance, through a whiteboard which can only be accessed when on-site, which can lead to errors and inefficiencies. DigiCal will provide a centralized, and easy-to-use platform for managing these processes.

A full list of features is provided in the WIKI:
[Features](https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh23/sh23-main/-/wikis/Feature-Specification)

The checklist and description of the MVP can be found here: [MVP](https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh23/sh23-main/-/wikis/MVP)

The motives behind the design of the code base can be found here: [Design Purposes](https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh23/sh23-main/-/wikis/Developer-Notes/Design-Purposes)

## Quickstart: Running on Localhost
This repository includes a docker file that manages project requirements.

### Pre-requisites: 
- Docker and docker-compose, check Docker's website for more information:
[Docker's Official Website](https://www.docker.com/get-started/)

Download the project via `clone` or by downloading the zip file. Then run the following in the main directory where sh23-main is:

`docker-compose -f ams_digical/docker-compose.yml up --build`

This builds and starts the docker images which run the different sections of the app (backend and frontend)


## Usage

DigiCal provides a centralized interface for managing samples, scheduling runs, and tracking lab maintenance. Below are some common use cases:

1. **Logging In** <br>
After running, access the web app at http://localhost:3000 (or your assigned domain in cases of server deployment). Log in using your institutional credentials via Microsoft Entra ID or DigiCal log in. If you have not logged in before, you will be presented with a registration page to fill in the rest of your details that the system needs. 

<br>

2. **Dashboard and Sidebar** <br>
After logging in you will be presented with the main dashboard that features tables for staff availability, sources, batches, maintenance & faults, and the calendar.

    To navigate to the sections listed below, click on the three bars in the top left corner to expand the sidebar, or follow the links presented in the tables themselves (where applicable). 

<br>

3. **Managing Samples** <br>
Navigate to the Samples section to add, edit, or delete sample records.
Click Add Sample, fill in the required details, and submit.

<br>

4. **Scheduling Batches** <br>
Navigate to the Sources / Batches section to add, edit or delete batches. Assign a sample to a scheduled batch run and the date the batch should be processed in. This should automatically reflect in the calendar.

<br>

5. **Lab Maintenance** <br>
Go to the Maintenance section to log upcoming maintenance tasks. Maintenances added without a date are scheduled as 'Faults' while ones with a start and end date are scheduled as 'scheduled maintenances'. Mark maintenance events as Completed when finished.

<br>

6. **Projection View** <br>
Navigate to Project to Screen from the sidebar and click on the button shown. This automatically fullscreens the app and displays the sample, maintenance, source, staff tables and the calendar.  

<br>

7. **Adding Events to the Calendar** <br>
Navigate to the main dashboard, or to the calendar page, and click on the day on the calendar you want to make an event for. You are free to use the buttons at the top of the calendar to navigate through to different months and years. 

    On clicking a day you will be presented with the option for creating an event for Batch Processing, Source Cleans, Maintenance, Staff Absence, and an Others option to add miscellaneous events. 

    To create the event, simply fill in the details in the provided boxes and press submit. After event creation, simply click on the event to edit its information or to remove the event entirely.

<br>

8. **Profile** <br>
Click on the profile button in the sidebar to be directed to the profile page. Here you will be presented with your personal information that you have provided in the registration process. If anything is incorrect or needs to be changed, press on the link at the bottom of the box to be directed to the edit profile page. 

    Once you are in the edit profile page, simply click on the boxes you would like to change the information for, type in the new content and hit the `Edit Profile` button in the bottom right corner to save your changes. On submission, you will be redirected to the dashboard. 

<br>

9. **Contact Team** <br>
This page, which can be navigated to from the sidebar, displays the staff information for your team. This features name, phone number, email, post and status. 

    If you realise any of the staff information is incorrect, there is a link at the bottom of the page which will redirect you to the edit staff information page. Once you are here, click on the dropbox to select the staff member you would like to change information for. Once you have finished changing any data, press the `Update Staff Information` button in the bottom right corner. On submission, the page will refresh and you can make other amendments if necessary. 

<br>

10. **Logging Out** <br>
To log out, open the sidebar and click the last icon in the options. This will log you out and redirect you to the login page. 

<br>

11. **Table Options** <br>
On any of the tables present on the website, there are options at the top:

    - `Columns`: This gives you the ability to select and deselect the items you would like to see in the table. 

    - `Filters`: This allows you to select options on how you want the data filtered through. For example, if you want to find all the staff members who are on Holiday
    - `Density`: This allows you to change the size of the table, making the columns and rows smaller or larger. 
    - `Export`: This allows you to export the data in the table into a .csv file or into a .pdf file (through the print option)
    - `Search`: This allows you to filter through the data with a specific search term. For example, make the table show the staff members with the post Manager by typing in Manager

    At the bottom of the tables, there are some additional options:
    - `Rows per page`: This allows you change the number of rows shown at a time

    - `< 1 >`: The arrows either side of the number allow you to move up or down a set of table data, in the case that there is more than the amount specified by `Rows per page`

<br>

12. **Additional Options** <br>

    - Underneath the profile icon there is an option that allows you to change the overall theme of the website from `Light` mode or to `Dark` mode. 
    - At the bottom of each page there is a copyright notice that directs you to the SUERC AMS website


## Testing

To test the Django backend, navigate to `sh23-main/ams_digical/` and see the command list below:

To run the test suite the command

```bash
python manage.py test
```

To run the coverage tests the following commands can be used

```bash
coverage run manage.py test
```
and to see a report in terminal you can use

```bash
coverage report
```
and to create a HTML version of the report in the htmlcov folder

```bash
coverage html
```

<br><br>

To test the React Frontend, navigate to `sh23-main/ams_digical/frontend/` and see the command list below:

To run the test suites,

```bash
npm test
```

To test a specific directory,

```bash
npm test src/__tests__/directory_name_here/
```

To test a specific test suite (file),

```bash
npm test src/__tests__/directory_name_here/test_file_name_here.test.jsx
```

Note that the ending of a test file follows the format of `.test.jsx` and that the test directory is preceded and followed by double underscores `__`.

## Support
See the authors section [https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh23/sh23-main#authors] for email addresses.

## Roadmap

By the end of December 2024:

    - Have a basic functionality calendar

By January 2025:

    - Have a minimum viable product (MVP) ready

By February 2025:

    - Refine the calendar and get it ready for deployment

By March 2025:

    - Have and deploy a fully functional calendar to the customer. 


## Authors 

Rhys Stewart - 2682261s@student.gla.ac.uk | 2682261s@gmail.com

Rayan Mohammed - 2865753m@student.gla.ac.uk

Max Ferguson

Yeva Mykhailovska

Aidan Ling

Thomas Tse


## MIT License

Copyright 2024, Team Project Group SH23 (see names above in the Authors section)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Project status
Project has concluded development (as of March 2025)
