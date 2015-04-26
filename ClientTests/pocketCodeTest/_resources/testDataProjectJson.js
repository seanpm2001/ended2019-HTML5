{"id":2283,"header":{"languageVersion":0.92,"description":"Download this program to start with the One Hour of Code tutorial at https:\/\/pocketcode.org\/hourOfCode ","title":"Skydiving Steve Tutorial","url":"http:\/\/pocketcode.org\/details\/2283","author":"catroweb","bricksCount":14,"device":{"screenHeight":1776,"screenWidth":1080,"screenMode":"STRETCH"}},"background":{"id":"s5","name":"Background","looks":[{"id":"s10","name":"sky"}],"sounds":[],"variables":[],"bricks":[]},"sprites":[{"id":"s6","name":"parachute","looks":[{"id":"s11","name":"paratrooper"}],"sounds":[],"variables":[],"bricks":[]},{"id":"s7","name":"target","looks":[{"id":"s12","name":"target"}],"sounds":[],"variables":[],"bricks":[]},{"id":"s8","name":"parcel","looks":[{"id":"s13","name":"parcel"}],"sounds":[],"variables":[],"bricks":[{"bricks":[{"type":"Hide"},{"percentage":{"type":"NUMBER","value":"50","right":null,"left":null},"type":"SetSizeTo"}],"type":"ProgramStart"},{"receiveMsgId":"s14","bricks":[{"type":"Show"},{"x":{"type":"USER_VARIABLE","value":"s1","right":null,"left":null},"y":{"type":"USER_VARIABLE","value":"s2","right":null,"left":null},"type":"PlaceAt"},{"bricks":[{"value":{"type":"OPERATOR","value":"MINUS","right":{"type":"NUMBER","value":"5","right":null,"left":null},"left":null},"type":"ChangeY"},{"condition":{"type":"OPERATOR","value":"LOGICAL_AND","right":{"type":"OPERATOR","value":"GREATER_THAN","right":{"type":"OPERATOR","value":"MINUS","right":{"type":"NUMBER","value":"100","right":null,"left":null},"left":{"type":"USER_VARIABLE","value":"s3","right":null,"left":null}},"left":{"type":"SENSOR","value":"OBJECT_X","right":null,"left":null}},"left":{"type":"OPERATOR","value":"LOGICAL_AND","right":{"type":"OPERATOR","value":"SMALLER_THAN","right":{"type":"OPERATOR","value":"PLUS","right":{"type":"NUMBER","value":"100","right":null,"left":null},"left":{"type":"USER_VARIABLE","value":"s3","right":null,"left":null}},"left":{"type":"SENSOR","value":"OBJECT_X","right":null,"left":null}},"left":{"type":"OPERATOR","value":"SMALLER_THAN","right":{"type":"OPERATOR","value":"PLUS","right":{"type":"NUMBER","value":"100","right":null,"left":null},"left":{"type":"USER_VARIABLE","value":"s4","right":null,"left":null}},"left":{"type":"SENSOR","value":"OBJECT_Y","right":null,"left":null}}}},"ifBricks":[{"x":{"type":"SENSOR","value":"OBJECT_X","right":null,"left":null},"y":{"type":"OPERATOR","value":"PLUS","right":{"type":"NUMBER","value":"100","right":null,"left":null},"left":{"type":"USER_VARIABLE","value":"s4","right":null,"left":null}},"type":"PlaceAt"},{"broadcastMsgId":"s15","type":"Broadcast"}],"elseBricks":[],"type":"IfThenElse"}],"type":"Forever"}],"type":"BroadcastReceive"},{"receiveMsgId":"s16","bricks":[{"type":"Hide"},{"x":{"type":"USER_VARIABLE","value":"s1","right":null,"left":null},"y":{"type":"USER_VARIABLE","value":"s2","right":null,"left":null},"type":"PlaceAt"}],"type":"BroadcastReceive"}]},{"id":"s9","name":"restart","looks":[{"id":"s17","name":"restart"}],"sounds":[],"variables":[],"bricks":[]}],"resourceBaseUrl":"http:\/\/localhost\/html5\/projects\/v0.1\/2283\/","images":[{"id":"s10","url":"images\/9c9b9b43b47b00008eb15e0c72808ecd_2014_08_15_041410.png","size":222148},{"id":"s11","url":"images\/1581e93cf174078c6ba6805bff216c17_2014_08_15_041354.png","size":415503},{"id":"s12","url":"images\/a75070545c64b571e9606e6c33b22c0d_2014_08_15_041340.png","size":225036},{"id":"s13","url":"images\/b2b9774d1a60399daf8a9eab7c1ebf9c_look.png","size":52232},{"id":"s17","url":"images\/4bcb3c90c99eee32cc97eb575766a9ee_2014_08_15_041258.png","size":787237}],"sounds":[],"variables":[{"id":"s1","name":"x"},{"id":"s2","name":"y"},{"id":"s3","name":"goalx"},{"id":"s4","name":"goaly"}],"broadcasts":[{"id":"s14","name":"start"},{"id":"s15","name":"win"},{"id":"s16","name":"restart"}]}


