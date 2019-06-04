
##  Jmeter integration with Maven

	A simple Jmeter project integrated with Maven which has .jmx file that is created by  
	recording[recording template] a test website.
	
## Overview
	1. Website under test http://demo.borland.com
	2. .jmx file contains basic jmeter features that shows usage of parameterization, If Controller,  
	Assertions, csv config  and other jmeter components.	
	
	
##  Pre-requisites

	1.  Java8 or higher should be installed.
	2.  Set JAVA_HOME
	3.  Install maven and set MAVEN_HOME
	4.  Add JAVA_HOME and MAVEN_HOME in your Path variable.

##  Project Structure
	
	1.  jmeter-testproject\src\test\jmeter contains Recording_Autogenerated_script.jmx
	and user.properties
	2.  jmeter-testproject\target\jmeter\reports\Recording_Autogenerated_script\index.html  
	is the report generated after running the script.
	
##  How to run Test

	1. To edit .jmx file open it in Jmeter.
	2. To run existing .jmx file type command "mvn clean verify".
	3. To edit number of threads, Iterations and rum up period update user.properties file.
	4. After run report will be generated in  
		jmeter-testproject\target\jmeter\reports\Recording_Autogenerated_script\index.html
	

	
