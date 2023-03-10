
"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It allows user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            let traitPrompt = prompt("Enter 'multi' to search by multiple traits or 'single' to search by a single trait: ").toLowerCase();
            switch (traitPrompt) {
                case 'multi':
                    searchResults = searchMultiTraits(people);
                    break;
                case 'single':
                    searchResults = searchByTraits(people);
                    app(people);
                    break;
            }
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }
    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);
}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }
    let displayOption = prompt(
        `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
    );
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            //! TODO #1: Utilize the displayPerson function //////////////////////////////////////////
            // HINT: Look for a person-object stringifier utility function to help
            let personInfo = displayPerson(person[0]);
            app(people);
            break;
        case "family":
            //! TODO #2: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person[0], people);
            alert(personFamily);
            app(people);
            break;
        case "descendants":
            //! TODO #3: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            alert(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = promptFor("What is the person's first name?", chars);
    let lastName = promptFor("What is the person's last name?", chars);
    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter((person) => person.firstName === firstName && person.lastName === lastName);
    return foundPerson;
}
// End of searchByName()

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people
            .map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person) {
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    personInfo += `Gender: ${person.gender}\n`;
    personInfo += `DOB: ${person.dob}\n`;
    personInfo += `Height: ${person.height}\n`;
    personInfo += `Weight: ${person.weight}\n`;
    personInfo += `Eye Color: ${person.eyeColor}\n`;
    personInfo += `Occupation: ${person.occupation}\n`;

    //! TODO #1a: finish getting the rest of the information to display //////////////////////////////////////////
    alert(personInfo);
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */

function promptFor(question, chars) {
    do {var response = prompt(question).trim(); 
    
    } while (!response || !chars(response));

    return response;
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function removes white spaces and lowercases a string.
 * @param {String} input        A string.
 * @returns {String}            The string lowercased and with white spaces removed.
 */
function chars(input) {
    return true; 
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line ????. Happy Coding! ????

function findPersonFamily(person, people) {
    let results = '';
    let siblingResult;
    let parentResult;
    let duplicateResult = person.id;
    let spouseId = person.currentSpouse;
    let parentId = person.parents;
    if (typeof spouseId == 'number') {
        let spouseResult = findSpouse(spouseId, people);
        results += `Spouse found:  ${spouseResult[0].firstName} ${spouseResult[0].lastName}`;
    }
    else {
        results += 'No spouse found.';
    }
    if (parentId.length === 0) {
        results += '\nNo parents found.\nNo siblings found.';
    }
    else {
        parentResult = findParents(parentId, people, duplicateResult);
        for (let parent of parentResult) {
            results += `\nParent found:  ${parent.firstName} ${parent.lastName}`;
        }
        siblingResult = findSiblings(parentId, people);
        for (let sib of siblingResult) {
            if (sib.id === duplicateResult) {continue;}
            results += `\nSibling found:  ${sib.firstName} ${sib.lastName}`;
        }
    }
    return results;
}

function findSpouse(spouseId, people) {
    let foundSpouse = people
        .filter((element) => element.id === spouseId);
    return foundSpouse;
}

function findSiblings(parentId, people) {
    let foundSiblings = people
        .filter((element) => element.parents.includes(parentId[0]) || element.parents.includes(parentId[1]));
    return foundSiblings;
}

function findParents(parentId, people, duplicateResult) {
    let foundParents = people
        .filter((element) => element.id === parentId[0] || element.id === parentId[1] && element.id != duplicateResult);
    return foundParents;
}

function findPersonDescendants(person, people){
    let foundGrandChildren = [];
    let foundChildren = people.filter(function(persona){
        for(let i = 0; i < persona.parents.length; i++){
            if(person.id === persona.parents[i]){
                let foundChild = persona;
                let grandChildren = people.filter(function(persona){
                    for(let j = 0; j < persona.parents.length; j++){
                        if(foundChild.id === persona.parents[j]){
                            foundGrandChildren.push(persona);
                            return true;
                        }     
                    }  
                })
                return true;
            }
        }
    })
    let personDescendants = '';
    if(foundChildren.length === 0){
        personDescendants += "No children found\n";
    }
    else{
        personDescendants += `Children found:\n${foundChildren[0].firstName} ${foundChildren[0].lastName}\n`;
        for(let i = 1; i < foundChildren.length; i++){
            personDescendants += `${foundChildren[i].firstName} ${foundChildren[i].lastName}\n`;     
            }}
    if(foundGrandChildren.length === 0){
            personDescendants += "\nNo grandchildren found";
        }
    else{
        for(let i = 0; i < foundGrandChildren.length; i++){
            personDescendants += `\nGrandchildren found:\n${foundGrandChildren[i].firstName} ${foundGrandChildren[i].lastName}\n`;     
        }}

    return personDescendants;
}

function displayResults(searchResults){
    let displayString = [];
    for(let result of searchResults){
        displayString += `${result.firstName} ${result.lastName} has this trait.\n`;
    }
    return displayString;
}
function searchByTraits(people){
    let foundResults = [];
    let searchTrait = promptFor(
        "Enter the trait you want to search by: 'gender', 'dob', 'height', 'weight', 'eye color', 'occupation', or 'main menu' to return to the main menu", chars);
        
        switch(searchTrait){
            case 'main menu':
                return app(people);

            case 'gender':
                foundResults = getGender(people)
                if(foundResults.length != 0){
                    alert(displayResults(foundResults))
                    break;
                }
                else {
                    return searchByTraits(people);
                }
            case 'dob':
                foundResults = getDOB(people)
                if(foundResults.length != 0){
                    alert(displayResults(foundResults))
                    break;
                }
                else;
                return searchByTraits(people);
            case 'height':
                foundResults = getHeight(people)
                if(foundResults.length != 0){
                    alert(displayResults(foundResults))
                    break;
                }
                else;
                return searchByTraits(people);
            case 'weight':
                foundResults = getWeight(people)
                if(foundResults.length != 0){
                    alert(displayResults(foundResults))
                    break;
                }
                else;
                return searchByTraits(people);
            case 'eye color':
                foundResults = getEyeColor(people)
                if(foundResults.length != 0){
                    alert(displayResults(foundResults))
                    break;
                }
                else;
                return searchByTraits(people);
            case 'occupation':
                foundResults = getOccupation(people)
                if(foundResults.length != 0){
                    alert(displayResults(foundResults))
                    break;
                }
                else;
                return searchByTraits(people);
            default:
                return app(people);        
        }
    }

function getGender(people) {
    let searchPrompt = promptFor('Enter gender: (male or female)', chars);
    let searchResults = people.filter((persona) => persona.gender === searchPrompt);
    return searchResults;
}
function getDOB(people) {
    let searchPrompt = promptFor('Enter date of birth:', chars);
    let searchResults = people.filter((persona) => persona.dob === searchPrompt);
    return searchResults;
}
function getHeight(people) {
    let searchPrompt = promptFor('Enter height:', chars);
    let searchResults = people.filter((persona) => persona.height === parseFloat(searchPrompt));
    return searchResults;
}

function getWeight(people) {
    let searchPrompt = promptFor('Enter weight:', chars);
    let searchResults = people.filter((persona) => persona.weight === parseFloat(searchPrompt));
    return searchResults;
}
function getEyeColor(people) {
    let searchPrompt = promptFor('Enter eye color: (blue, brown, black, green, or hazel)', chars);
    let searchResults = people.filter((persona) => persona.eyeColor === searchPrompt);
    return searchResults;
}
function getOccupation(people) {
    let searchPrompt = promptFor(
        'Enter the occupation: (programmer, assistant, landscaper, nurse, student, architect, doctor, or politician)', chars);
    let searchResults = people.filter((persona) => persona.occupation === searchPrompt);
    return searchResults;
}

function searchMultiTraits(people) {
    let results = people;
    let userConfirmed = false;
    while (userConfirmed === false) {
    let userInputProp = prompt("Enter the trait you would like to search by: ");
    let userInputVal = prompt("Enter the value you would like to search by: ");
    results = results.filter(function(el){
        return el[userInputProp] === userInputVal;
    })
    if (results.length >= 1){
         alert(displayResults(results));
         let userContinue = prompt("Would you like to search an additional trait y/n: ")
         if (userContinue === "n") {
            userConfirmed = true
         }
    }
    else if (results.length === 0){
        alert("Sorry no results. Try again.")
        return searchMultiTraits(people);
    }    
    }
    return results;
}