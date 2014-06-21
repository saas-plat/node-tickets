# node-tickets

Issue, Milestone, and Task tracker built on NodeJS

## Goals

### Record Creation (duh!)
+ Types:
  * Issue
  * Task
  * Bug
  * RFC (Request For Change)
  * Enhancement
+ Identifies a Owner (who raised it)
+ Can assign others, or yourself.
+ Can subscribe to updates without actually being an assignee.
  * Updates arrive in the form of a notification.
+ Create and assignee users can 'update' a record, others who contribute appear as a 'comment'.
+ A comment can be 'flagged' for review, hiding it from view unless you are the owner or assignee.
+ Status, Priority, Resolution, and Module fields can Toggle on/off usage per Record type.
+ Additional fields can Toggle on/off usage per Record type as well as be 'captioned' per Record type (e.g. for Milestone 'expire' may be captioned as 'released').

### Planning
+ Milestone (for child Records to be identified)
  * Outlines the goals for which a record will resolve/address.
+ Release (for Milestones to be identified)
  * Outlines the release process, scripts to be run, files added/delete/modified, rollback details, ect.
+ Project (for Releases to be identified)
  * Outlines the business requirements, will contain project manager and analyst contributed documentation.

NOTE: Milestone, Release, and Project are actually types of records also - this allows flexibility (e.g. projects within projects).

### Administration
+ User Groups provide permissions, link a User to a single Group for that user to gain access that group allows.
+ Permissions:
  * Grant access to specific parts of the application.
  * Grant permission to perform actions like create, delete, attachments, even comment.
  * Grant Visibility of Records, limited by record type.
+ Configuration, with elevated privileges Users can configure;
  * Record types renaming.
  * Deactivate Record Types application wide.
  * Toggle on/off field usage per Record type.
  * Caption fields per Record type.

### Auditing
+ Elevated privileges can be set so Users can view the log.
+ Auditing can be deactivated application wide.

### Secure
+ All application routes required valid login, excluding those for registration and login.
+ Registrations can be limited to a domain name to prevent spam in registration.
+ Passwords are stored HMAC-SHA1 encrypted using crypto and cryptographically strong due to configurable length pseudo-random data, salt, and configurable iterations to add cost of evaluating the hash.

## Schema
![proposed schema](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_schema.png "data model")

## Technologies

* NodeJS (naturally)
* Express framework
* Nginx (static content delivery for production)
* Sequelize ORM (MySQL, MariaDB, SQLite or PostgreSQL databases)
* Handlebars (Mustash template engine)
* Angular.js (view logic)
* Scaled: Clustered instances for as many available CPUs.
* Modern & Responsive: Using Twitter Bootstrap 3.1 with many UI/UX enhancing plugins.

## Screenshots

### Easy Login and Registration
![user login](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_login.png "login")
![user registration](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_register.png "register")
### Restrict Registrations to your Domain (reduce spam)
![restrict registrations](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_domain.png "domain")
### Create Records Anytime
![user action audit](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_create.png "create")
### Configure Access Permissions
![user action audit](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_groups.png "group")
### User Action Audit Tool
![user action audit](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_audit.png "audit")
### Configurable Record Types
![configure types issue](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_type_issue.png "issue")
![configure types project](https://raw.github.com/chrisdlangton/node-tickets/master/demo/demo_type_project.png "project")

## Permissions

Feel free to fork, copy, or re-use any code in this repo keeping in mind licenses and of course giving credit to original authors.

## Want to Contribute?

I am looking for talented people with at least moderate experience using NodeJS, Handlebars, and git.
You do not need any experience with other technologies like Sequelize as these can be learned while working ont he project.

Contact me (Chris Langton) by email [chris (at) codewiz (dot) biz]() or on Twitter [@chrisdlangton](http://twitter.com/chrisdlangton)

## Project skeleton

Modified fork of [inadarei/nodebootstrap](https://github.com/inadarei/nodebootstrap)

## License

(The MIT License)

Copyright (c) 2012-2014 Chris Langton [@chrisdlangton](http://twitter.com/chrisdlangton)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
