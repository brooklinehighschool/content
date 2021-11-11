World Language Frequently Asked Questions  

--------------------------------------------

 
function toggleLayer( whichLayer )
{
  var elem, vis;
  if( document.getElementById ) // this is the way the standards work
    elem = document.getElementById( whichLayer );
  else if( document.all ) // this is the way old msie versions work
      elem = document.all\[whichLayer\];
  else if( document.layers ) // this is the way nn4 works
    elem = document.layers\[whichLayer\];
  vis = elem.style;
  // if the style.display value is blank we try to figure it out here
  if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)
    vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';
  vis.display = (vis.display==''||vis.display=='block')?'none':'block';
}

[](javascript:toggleLayer('FAQ0');)

### [What are the graduation requirements in terms of World Language?](javascript:toggleLayer('FAQ0');)

Students need to have successfully completed two consecutive years in the same language during their high school years.

For example:

Grade 9: Chinese 3 

Grade 10: Chinese 4H

  

[](javascript:toggleLayer('FAQ1');)

### [How many years of a language do many colleges expect?](javascript:toggleLayer('FAQ1');)

At least 3 years of a world language.

  

[](javascript:toggleLayer('FAQ2');)

### [How many years of WL do most students take?](javascript:toggleLayer('FAQ2');)

About 95% of all students study a world language for all four years.

  

[](javascript:toggleLayer('FAQ3');)

### [Can I study more than one world language?](javascript:toggleLayer('FAQ3');)

It is sometimes possible but...

Students have a variety of graduation requirements.  If students are interested in taking more than one language, they need to discuss its long-term scheduling implications with their guidance counselor.  World Languages do not count as elective courses, and therefore cannot be substituted for Career Ed, Visual Arts, or Performing Arts.

In addition, students might have other needs such as Tutorial which might restrict their ability to add an extra world language.

Finally, BHS needs to consider its budgetary needs.  There might be years when we cannot offer two world languages, and students will need to choose between the two.

  

[](javascript:toggleLayer('FAQ4');)

### [Can ELL credits be substituted for WL credits?](javascript:toggleLayer('FAQ4');)

Yes. However the same 1 credit of ELL cannot be substituted for 1 credit of World Language credit and 1 credit of English.

* * *

[Return to **World Language Home**](/world-language.html)