$(document).ready(function() {
// This is a program which calculates and displays all the subsets of a set defined by the user.
// Due to calculation time limitations, it only accepts sets with upto 16 members.
// IMPORTANT NOTE: This program uses non-recursive method to calculate the subsets.

  // These are global variables including the set itself, a variable for maintaining the number of members,
  // an array which maintains information about the members which are included in a specific subset, and a
  // variable that indicates the line number of each subset in the output.
  var set = [];
  var numMembers = 0;
  var includedMembers = [];
  var lineNumber;

  // This constant defines the maximum number of members of the set.
  const _MAX_MEMBER_NUM = 16;

  // Initially, the member field (identified as #member) gets focus.
  $("#member").focus();



//       ***********************************
//    *****************************************
// *************** MAIN FUNCTIONS ****************
//    *****************************************
//       ***********************************


// This function marks the members to be included in the subsets and displays the generated subsets.
// This is the most important function in this program.
  function displaySubsets(numberOfMembers)
  {
    // This variable marks the first member in the scope where we are working on. Its counterpart in the recursive program is "start" variable.
    var baseIndex = 0;
    // This variable identifies the members to get included in and then excluded from the subsets.
    var sweepingIndex = 0;
    lineNumber = 1;
    // Initially, the empty set is added to the list of subsets.
    totalSubsetsString = lineNumber + ": " + enclosedSetString("");

    // Since for sets with more than 13 members it may take a few seconds to calculate, the user is informed properly.
    if(numMembers >= 14)
    {
      alert("The calculations may take a few moments. Please press OK and wait.");
    }

    // This (outer) loop traverses all the members.
    while (baseIndex < numberOfMembers)
    {
      // All the subsets are generated in this (inner) loop.
      while (sweepingIndex < numberOfMembers)
      {
        // It marks the member identified by "sweepingIndex" to be included in the subset. The marked members collectively form a subset of the set.
        includeMember(sweepingIndex);
        // The complete subset (along with the line number and enclosing "{}") returned from oneSubset function
        // is concatenated to the global variable "totalSubsetsString" to be displayed at the end of calculations.
        totalSubsetsString += oneSubset();
        sweepingIndex++;
      }

      // The last member of the set is excluded from the next subset.
      sweepingIndex--;
      excludeMember(sweepingIndex);

      // This loop finds the first included member of the set in the scope starting from the end of the set back to
      // baseIndex (if we move forward from the first member of the set, it will be the last included member of the set).
      do {
        sweepingIndex--;
      } while (sweepingIndex > baseIndex && !isMemberIncluded(sweepingIndex));

      // Either the included member found in the previous loop or the member with index equal to "baseIndex" gets excluded.
      excludeMember(sweepingIndex);

      // if all the subsets which include a specific member are shown, "baseIndex" will be increased to start from the very next member for the future subsets.
      if(sweepingIndex <= baseIndex)
      {
        baseIndex++;
      }

      sweepingIndex++;
    }

    // The string containing all the subsets is shown in the "result" textarea.
    $("#result").val(totalSubsetsString);
  }


// This function displays the generated subsets.
  function oneSubset()
  {
    // This variable identifies it is the first member of the subset, so a "," does not lead it.
    var firstMember = true;
    // This variable holds the string containing all the members of the subset.
    var str = "";

    // This loop scans all the members of the set.
    for(var memberIndex = 0; memberIndex < numMembers; memberIndex++)
    {
      // If a member is marked as included in the subset, it concatenates it to the "str" variable.
      if(isMemberIncluded(memberIndex))
      {
        if(firstMember)
        {
          str += getMember(memberIndex);
          firstMember = false;
        }
        else
        {
          str += ", " + getMember(memberIndex);
        }
      }
    }

    // The complete subset along with the line number and enclosing "{}" is returned to
    // the calling function (which is generateSubsets).
    lineNumber++;
    return lineNumber + ": " + enclosedSetString(str);
  }



//       ***********************************
//    *****************************************
// ************** HELPER FUNCTIONS ***************
//    *****************************************
//       ***********************************
// These functions are simple and self-explanatory.

  function includeMember(index)
  {
    includedMembers[index] = true;
  }


  function excludeMember(index)
  {
    includedMembers[index] = false;
  }


  function isMemberIncluded(index)
  {
    return ( includedMembers[index] ? true : false );
  }


  function getMember(index)
  {
    return set[index];
  }


  function addMember(value)
  {
    set[numMembers] = value;
    numMembers++;
  }


  function isNotEmptySet()
  {
    return ( numMembers != 0 ? true : false );
  }


  function exists(member)
  {
    for(var index = 0; index < numMembers; index++)
    {
      if(getMember(index) === member)
      {
        return true;
      }
    }

    return false;
  }


  function isNotValidMember(str)
  {
    return ( str.search(',') >= 0 ? true : false );
  }


  function enclosedSetString(str)
  {
    return "{" + str + "}" + String.fromCharCode(13); //UTF code for CR key
  }


  function isNotEmpty(str)
  {
    return ( str !== "" ? true : false );
  }


  function fillSetTextarea()
  {
    var str = getMember(0);

    for(var index = 1; index < numMembers; index++)
    {
      str += ", " + getMember(index);
    }

    $("#set").val(enclosedSetString(str));
  }


  function reinitialize()
  {
    numMembers = 0;
    $("#set").val(enclosedSetString(""));
    $("#result").val("");
    $("#membersNumber").css("visibility", "hidden");
    empty($("#member"));
  }


  function empty(element)
  {
    element.val("");
    element.focus();
  }



//       ***********************************
//    *****************************************
// *********** EVENT-HANDLER FUNCTIONS ***********
//    *****************************************
//       ***********************************


//This event is triggered when the user clicks "Add member" button.
  $("#addMember").click(function()
  {
    // These variables maintain the "member" field itself and its value, respectively.
    var $member = $("#member");
    var theMember = $member.val();

    // If the "member" field is empty, this function does nothing.
    if(isNotEmpty(theMember))
    {
      // If the user tries to add more members than the limit (16) the program declines by showing a proper message.
      if(numMembers >= _MAX_MEMBER_NUM)
      {
        alert("Maximum number of the members is " + _MAX_MEMBER_NUM + ".");
        return;
      }

      // If the user tries to add a member which already exists in the set, the program declines by showing a proper message.
      if(exists(theMember))
      {
        alert("It is a duplicate! A set cannot have identical members.");
        empty($member);
        return;
      }

      // If the user tries to add a member which contains the "," character, the program declines by showing a proper message.
      if(isNotValidMember(theMember))
      {
        alert('A member cannot contain character "," because it is a separator.');
        empty($member);
        return;
      }

      // These lines Empty the "result" textarea and hide membersNumber p tag.
      $("#result").val("");
      $("#membersNumber").css("visibility", "hidden");
      // It adds the member to the set.
      addMember(theMember);
      // It generates and shows (refreshes) the content of the "set" textarea to reflect adding the new member.
      fillSetTextarea();
      // It emptys the "member" field.
      empty($member);
    }
    $member.focus();
  });


//This event is triggered when the user clicks "Remove all members" button.
  $("#removeAll").click(function() {
    // If the set is not empty and the user confirms the removal, all the members of the set will be removed.
    if(isNotEmptySet() && confirm("All members will be removed. Are you sure?"))
    {
      reinitialize();
    }

    $("#member").focus();
  });


//This event is triggered when the user clicks "Calculate subsets" button.
  $("#submit").click(function() {
    // It invokes the function which calculates and shows all the subsets of the set.
    displaySubsets(numMembers);
    // These lines generate a message which will be shown in a p tag under the "result" textarea.
    message = "The total number of subsets is: ";
    message += "<span class=important_note>";
    message += "2 ^ " + numMembers + " = " + Math.pow(2, numMembers);
    message += '</span>';
    // These lines show the message and make the p tag visible (it is hidden by default).
    $("#membersNumber").html(message);
    $("#membersNumber").css("visibility", "visible");
  });

});
