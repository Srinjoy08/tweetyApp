import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MentionConfig } from 'angular-mentions';

declare var require: any
@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit {
  dateFormat:any;
  tweetData='';
  userName:any;a
  baseUrl:any='https://mytweetapi.azurewebsites.net/tweetapp/';
  userData:any;
  replyData:any
  allTweets:any;
   
   mockTweet:any=[];
   replyTweetData:any=[];
  
  constructor(private http:HttpClient,private toastr:ToastrService) { }

  ngOnInit(): void {
  
    
    this.userName=localStorage.getItem('token');
    let userNameUrl=this.baseUrl+"fetchUserDetails/"+this.userName;
    this.http.get(userNameUrl).subscribe(result=>{
      this.userData=result;
      console.log("UserData:",this.userData);
    })
    let getTweetUrl=this.baseUrl + 'tweets'
    this.http.get(getTweetUrl).subscribe(result=>{
      this.allTweets=result;
      console.log("AllTweets::",this.allTweets);
    })
  }
postTweet(){
  let dateTime = new Date().getTime();
  this.dateFormat=formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en').toString();
  this.mockTweet=[]
  this.mockTweet=
    {
      "createdOn":this.dateFormat,
      "body":this.tweetData,
      "postedBy":"",
      "loginId":this.userName,
      "replies":[]
 
    }
  
  let postTweetUrl=this.baseUrl+'tweets/tweet'
  
  this.http.post(postTweetUrl,this.mockTweet).subscribe(result=>
    {
      this.toastr.success('Tweet Posted Successfully!!!')
      
     this.getAllTweets();
    },
    error=>{
      this.toastr.error('Cannot Post Tweet due to some technical error');
    })
  this.tweetData=''
  
  console.log("tweet-data:::",this.mockTweet);
  
}
getAllTweets(){
  let getTweetUrl=this.baseUrl + 'tweets'
  this.http.get(getTweetUrl).subscribe(result=>{
    this.allTweets=result;
  
    console.log("AllTweets::",this.allTweets);
  })
}
replyTweet(replyId,replyData){
  let dateTime = new Date().getTime();
  let dateFormat=formatDate(dateTime, 'yyyy-MM-dd HH:mm:ss', 'en').toString();
  console.log("reply-data",replyData)
this.replyTweetData=
  {
    "replyBody":replyData,
    "replyTimestamp":dateFormat,
    "repliedBy":'',
    'replyLoginId':this.userName,
    "tweetId":replyId
  }
  let replyUrl=this.baseUrl+'postReply/reply'
this.http.post(replyUrl,this.replyTweetData).subscribe(result=>{
  this.toastr.success('You replied to the tweet')
  this.getAllTweets()
})
this.replyData=''
console.log("replied::",this.replyTweetData)
}
}
