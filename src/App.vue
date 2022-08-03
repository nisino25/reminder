<template>

<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
</head>

<body >
  <div class="wrapper">
    
    <header class="menu-bar" style="z-index: 4;">
      <span class="menu-left-btn" @click="showingPage = 'main'"><i class="material-icons callendar" style="font-size:180%; margin-right:10px; ">insert_invitation</i></span>

      <span class="menu-middle-btn" style="color:white;  margin-top:-10px; font-size:150%; text-align:center" @click=" showModal = true">Reminder</span>
          
      <span class="menu-right-btn material-icons" @click="startInputting($event)">create</span>
      <br><br>
          
    </header>

    <div style="margin-top:65px; z-index: 3;" class="actual-content">

      <div class="main" v-if="showingPage == 'main'">
        <div style="">

          <div style="margin-left:10px">
            <label for=""><span style="color: #006a4e">{{totalNum.finished}}</span> tasks completed so far </label>
            <br>
            <label for=""><span style="color: #b22222">{{totalNum.unfinished}}</span> tasks left</label>
            <!-- <button style="float:right" @click="addRandom(5)">Add random</button> -->
            <button style="" class="undo-button" @click="undoTask()" >Undo</button>
            <hr>
          </div>
          
          <div class="timeline"  v-if="reminderList.length !==0 " >
            <div  v-for="(reminder, i) in reminderList " :key="i">
              
            <div class="container left " v-if="!reminder.finished" :class="[(reminder.animation ? 'fadeout ': ''),(reminder.fadein ? 'w3-animate-zoom': '')] " style="opacity:1"  >
                <i class="icon fa fa-home" style="border: 2px solid SteelBlue;" @click="removeTask(i)" >
                  <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" v-if="reminder.checkmark">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </i>
                <div class="content content-left">
                  <h2 style="">{{reminder.task}}</h2>
                  <p  :style="[checkLimit(reminder.limit) ? 'color:Grey': 'color: Red']">{{reminder.limit}}</p>
                  
                </div>
                <!-- <i class="icon-right fa fa-home" style="border: 2px solid SteelBlue" @click="removeTask(i)">i</i> -->
                
              </div>

            </div>
          </div>

        </div>


      </div>

    </div> 

    <transition name="fade" >
      <!-- <div class="modal-overlay fade-in " v-if="showModal"  @click="showModal = false" :style="{ height: pageHeight}">
        <div class="modal"   >
          <h1>Lorem Ipsum</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem provident explicabo accusamus laudantium voluptatum nobis sed nesciunt neque possimus molestiae?</p>
          <button class="button" @click="showModal = false">
            Close Modal
          </button>
        </div>
      </div> -->
      <div class='modal-overlay fade-in' v-if="showModal" :style="{ height: pageHeight}">
        <div class="modal">

          <div>
            <form onsubmit="event.preventDefault()">
              <label for="fname">Task Title</label>
              <input type="text" placeholder="Task Title.." v-model="taskTitle" @keyup.enter="createTask()">

              <label for="lname">Date</label><br>
              <input type="date" id="start" name="trip-start"
              v-model="selectedDate">

              <br><br>
              <label for="Repad" style="">Repeating</label><br>


              &nbsp;<input type="radio" id="one" value="once" v-model="radioPick">
              <label for="once"> Once</label>

              &nbsp;<input type="radio" id="two" value="everyday" v-model="radioPick">
              <label for="two"> Everyday</label>

              <!-- <button style="float:right; margin-right:0px; font-size:85%" @click="showMoreOptions 
              = true" v-if="!showMoreOptions">more options </button>
              <button style="float:right; margin-right:0px; font-size:85%" @click="showMoreOptions = false" v-else>close </button> -->

              <br>

              <!-- <div v-if="showMoreOptions">
                &nbsp;<input type="radio" >
                <label for="once"> Weekly</label>

                &nbsp;<input type="radio">
                <label for="two"> Monthly</label>
                <br>

                &nbsp;<input type="radio" >
                <label for="once"> Biweekly</label>

                &nbsp;<input type="radio">
                <label for="two"> Yearly</label>
                <br>

                &nbsp;<input type="radio" >
                <label for="once"> Weekdays</label>

                &nbsp;<input type="radio">
                <label for="two"> Weekend</label>
              </div> -->
              
              <button @click="createTask()" class="submit" >Create</button>
              <button @click="closingModal()" class="cancel" >Cancel</button>

            </form>
          </div>

        </div>
        
      </div>

      
    </transition>
    
  </div>
</body>
  
</template>

<script>
export default {
  name: 'App',

  data(){
    return{
      // clearLocal: true,
      clearLocal: false,
      notNow: true,
      dataList: [],
      showingPage: 'main',

      current: {
        year: undefined,
        monthlyCount: undefined,
        month: undefined,
        date: undefined,
        yoobi: undefined,
        display: undefined,
      },
      monthlyList:['','Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec',],
      yoobiList:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],

      reminderList: [],
      undoList: [],
      showModal: false,
      pageHeight: undefined,

      taskTitle: '',
      selectedDate: undefined,
      radioPick: 'once',
      showMoreOptions: false,

    }
  },
  mounted(){
    if(localStorage.firstTime && !this.clearLocal){
      console.log('found it')
      this.reminderList = JSON.parse(localStorage.reminderList); 
    }else{
      console.log('welcome and now creating') 
      let flag = false
      localStorage.firstTime = JSON.stringify(flag); 
      
      // this.createCalendar();
      localStorage.reminderList = JSON.stringify(this.reminderList); 
    }

    let dateObj = new Date();
    this.current.year = dateObj.getFullYear()
    this.current.month = dateObj.getMonth()+ 1
    this.current.monthlyCount = this.monthlyList[dateObj.getMonth()+ 1]
    this.current.date = dateObj.getDate()
    this.current.yoobi= this.yoobiList[dateObj.getDay()]
    this.current.display = this.current.year + '/' + this.current.month + '/' + this.current.date + '/' + this.current.yoobi

    this.selectedDate = this.current.year + '-' +this.current.month + '-' + this.current.date     
    this.getPageHight();
    // console.log(this.checkLimit('2021-11-10'))
    // this.addRandom(15)

  },
  created(){
    // this.checkLimit('2021-10-2')
    // console.log(this.checkLimit('2021-10-2'))
  },
  methods: {
    createTask(){
      // console.log('adding new one')
      if(this.taskTitle == ''){
        // alert('Task title cannot be empty')
        return
      }
      let reminder = {}
      reminder = {task: this.taskTitle, finished: false, created: Date.now(), limit: this.selectedDate, repeating: this.radioPick, animation: false, checkmark: false,fadein: true, }
      this.reminderList.push(reminder)

      this.closingModal() 

    },

    startInputting(){
      this.getPageHight();
      this.pageHeight = document.querySelector('HTML').scrollHeight + 'px'
      // console.log(this.pageHeight)
      this.showModal = true;
    },
    getPageHight(){
      this.pageHeight = document.querySelector('HTML').scrollHeight + 'px'
    },

    closingModal(){
      this.showModal = false
      this.taskTitle = ''
      this.radioPick = 'once'
      this.showMoreOptions = false
      this.selectedDate = this.current.year + '-' +this.current.month + '-' + this.current.date;
    },

    // -------------------------------------


    addRandom(num){
      let count = 0
      let randomNum = undefined
      const wordList = ['a','b','c','d','e','f','g','h','g']
      let theString = ''
      let randomCount = 0
      let reminder = {

      }

      while(count < num){
        randomCount = 0
        theString = ''
        while(randomCount < 10){
          randomNum = Math.floor(Math.random() * (9));
          theString = theString +  wordList[randomNum]
          randomCount++
        }
        // console.log(theString)
        reminder = {task: theString, finished: false, created: Date.now(), limit: this.selectedDate, repeating: this.radioPick, animation: false, checkmark: false,fadein: true,}
        this.reminderList.push(reminder)

         
        count++
      }
    },

    checkDeadline(num){
      if(num == 3){
        console.log(num)
      }
      return false
    },

    removeTask(i){
      // if(this.reminderList[i].repeating !== 'once'){

      //   return
      // }

      this.reminderList[i].checkmark = true
      this.undoList.push(i)

      setTimeout(() =>
      this.reminderList[i].animation = true
      , 1350); 
      

      setTimeout(() =>
      this.reminderList[i].finished = true
      , 1800); 

      


      
      // console.log(this.reminderList[i])
    },
    undoTask(){
      if(this.undoList.length > 0){
        let lastIndex = this.undoList.length -1
        let theIndex = this.undoList[lastIndex]
        this.reminderList[theIndex].finished = false
        this.reminderList[theIndex].checkmark = false
        this.reminderList[theIndex].animation = false
        this.reminderList[theIndex].fadein = true
        
        
        setTimeout(() =>
        this.reminderList[theIndex].fadein = false
        , 1000); 

        // this.reminderList.push(this.undoList[lastIndex])
      }
    },
    checkLimit(theString){

      // console.log(theString)
      let year =  Math.floor(theString.split('-')[0])
      let month = Math.floor(theString.split('-')[1])
      let date = Math.floor(theString.split('-')[2])
      // console.log(this.current.year,this.current.month,this.current.date)

      if(year > this.current.year  ){
        return true
      }else if(year < this.current.year){
        return false
      }
      // console.log('pass year check')

      if(month > this.current.month ){
        return true
      }else if(month < this.current.month){
        return false
      }
      // console.log('pass month check')

      if(date > this.current.date ){
        return true
      }else {
        return false
      }
      // console.log('pass date check')
      // check year first, month, date
      // give flag only when date is the identical
      // this.selectedDate = this.current.year + '-' +this.current.month + '-' + this.current.date  

    },

    // -------------------------------------
      
    
  },
  computed:{
    totalNum: function(){
      let list = {}
      list.unfinished = 0
      list.finished = 0


      if(this.reminderList.length == 0){
        return list
      }

      // let list = {}
      let count = 0
      


      while(count< this.reminderList.length){
        if(this.reminderList[count].finished){
          list.finished++
        }else{
          list.unfinished++
        }
        count++
      }
      return list
      // list.undefined = 
    },
  },
  watch:{
    reminderList: {
      deep:true,
      handler() {
        localStorage.reminderList = JSON.stringify(this.reminderList); 
      }
    },
  }

}
</script>

<style>

  *,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f2f2f2;

  height: 100vh;
}


/* ---------------------------------------------------------------- */
/* timeoline  */
.timeline {
  position: relative;
  width: 100%;
  /* max-width: 1140px; */
  margin: -25px auto;
  padding: 15px 0;
  transition: all 0.5s ease;
}
.timeline::after {
  content: '';
  position: absolute;
  width: 2px;
  background: SteelBlue ;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -1px;
}


.container {
  /* padding here  */
  padding: 5px 15px;
  position: relative;
  background: inherit;
  width: 50%;
  
}
.container.left {
  left: 0;
}
.container::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: calc(50% - 8px);
  right: -8px;
  background: #ffffff;
  border: 2px solid SteelBlue ;
  border-radius: 16px;
  z-index: 1;
}
.container::before {
  content: '';
  position: absolute;
  width: 50px;
  height: 2px;
  top: calc(50% - 1px);
  right: 8px;
  background: SteelBlue ;
  z-index: 1;
}

.container .icon {
  /* icon height hsouldb e don here  */
  position: absolute;
  display: inline-block;
  width: 30px;
  height: 30px;
  padding: 9px 0;
  /* top: 26%; */
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  border: 2px solid SteelBlue ;
  
  border-radius: 40px;
  text-align: center;
  font-size: 18px;
  color: SteelBlue ;
  z-index: 1;
}

.icon-right {
  position: absolute;
  display: inline-block;
  width: 25px;
  height: 25px;
  padding: 9px 0;
  /* top: calc(50% - 20px); */
  /* top: 100px; */
  /* background: #F6D155; */
  /* border: 2px solid #009688; */
  /* SteelBlue */
  border: 2px solid SteelBlue ;
  
  border-radius: 40px;
  text-align: center;
  font-size: 18px;
  color: SteelBlue ;
  z-index: 1;
}
.container.left .icon {
  right: 56px;
}

.icon-right {
  right: 0px;
}
.container .content {
  padding: 30px 90px 30px 30px;
  position: relative;
  border-radius: 0 500px 500px 0;
}
.container .content-left{
  background: lightgrey;
}
/* .container.right .content {
  padding: 30px 30px 30px 90px;
  border-radius: 500px 0 0 500px;
} */
.container .content h2 {
  margin: -12px 0 0px 0;
  /* font-size: 18px; */
  font-size: 95%;
  font-weight: normal;
  color: black;
  max-width:100%;
  word-wrap:break-word;
}
.container .content p {
  margin: 0;
  margin-bottom: -18px;
  /* font-size: 16px; */
  font-size: 80%;
  line-height: 22px;
  color: #000000;
}







@media (max-width: 767.98px) {
  .timeline::after {
    /* main vertical lline */
    left: 25px;
  }
  .container {
    width: 100%;
    padding-left: 55px;
    /* padding-right: 30px; */
  }
  .container.left::after{
    left:17px;
  }
  .container.left::before {
    /* horizontal line  */
    left: 20px;
    width:50px;
    border-color: transparent SteelBlue transparent transparent;
  }
  .container.left .date {
    right: auto;
    left: 15px;
  }
  .container.left .icon{
    /* icon cirlce */
    right: auto;
    left: 70px;
  }
  
  .icon-right{
    /* icon cirlce */
    right: 0px;
    margin-right: 25px;
    /* left: 70px; */
  }
  .container.left .content{
    padding: 20px 20px 20px 65px;
    border-radius: 500px 0 0 500px;
  }
}




/* ------------------------------------------------ */
.task-card{
  padding: 10px;
  border: 1px solid black;
  /* margin-bottom: 20px; */
}

.menu-bar{
  /* background-color: rgb(26, 115, 232);; */
  /* background-color: DarkSlateBlue; */
  background-color: SteelBlue;
  position:fixed;
  padding:0;
  margin:0;
  top:0;
  left:0;
  padding-top: 10px;
  /* padding-left: 10px; */
  width: 100%;
  height: 55px;
  color:white;
}
.menu-left-btn{
  float: left;
  margin-left: 12px;
  margin-top: 5px;
} 
  
.menu-middle-btn{ 
  /* margin-right: 12px; */
  /* margin-top: 30px; */
  position: absolute;
  top: 25px;
  display: flex;
  justify-content: center;
  text-align: center;
  left: 50%;
  right: 50%;
}

.menu-right-btn{
  float: right;
  margin-right: 12px;
  font-size: 150%;
  margin-top: 6px;
}


/* ------------------------------ */


.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #7ac142;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards
}

.checkmark {
    width: 31.5px;
    height:31.5px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin-top: -12.5px;
    margin-left: -2.6px;
    /* margin: 10% auto; */
    box-shadow: inset 0px 0px 0px #7ac142;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0
    }
}

@keyframes scale {

    0%,
    100% {
        transform: none
    }

    50% {
        transform: scale3d(1.1, 1.1, 1)
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px #7ac142
    }
}

/* ------------------------------ */

.fadeout{
  transform: scale(0);
  transition: .6s ease opacity,1s ease transform;
}



/* ---------------------------------- */
/* modal  */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* bottom: 0; */
  /* height: 667px; */
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  
  width: 85%;
  max-width: 400px;
  background-color: #f2f2f2;
  border-radius: 16px;
  
  padding: 25px;
}

.modal h1 {
  color: #222;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 15px;
}
 
.modal p {
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 15px;
}

.fade-in {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: .4s;
}
@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}



/* ----------------------------------------------------------------------------- */
input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.modal  .submit {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 20px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal  .cancel {
  width: 100%;
  background-color: firebrick;
  color: white;
  padding: 14px 20px;
  margin: 5px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.undo-button{
  float:right;
  margin-right:15px;
  width: auto;
  background-color: grey;
  color: white;
  padding: 4px 5px;
  /* margin: 5px 0; */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}







</style>

