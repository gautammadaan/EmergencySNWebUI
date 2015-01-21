var host_url = "http://localhost:1234/ssnoc";

module.exports = {
  'get_all_users' 		:	host_url + '/users',
  'is_password_valid' 	:	host_url + '/user/',
  'get_user' 			:	host_url + '/user/',
  'post_new_user' 		:	host_url + '/user/signup',
  'post_new_status' 	:	host_url + '/user/',
  
//  Chats, messages
  'get_wall'			:	host_url + '/messages/wall',
  'post_new_chat' 		:	host_url + '/message',
  'get_chat_message' 	:	host_url + '/messages',
  'get_chat_users' 		:	host_url + '/users',
  
// Performance testing & Analysis
  'testPerformance'		:	host_url + '/performance',
  'post_on_wall'		:	host_url + '/message',
  'anlyseNetwork'		:	host_url + '/analysis',
  
// Search
  'search'				:	host_url + '/search',
  
// Update user 
  'put_userupdate'		:	host_url +'/user/',
  
// Memory
  'memory_start' 		: 	host_url + '/memory/start',
  'memory_stop' 		: 	host_url + '/memory/stop',
  'memory' 				: 	host_url + '/memory/',
  'delete_memory' 		: 	host_url + '/memory',
  'get_memory' 			: 	host_url + '/memory/getMemory',
  'memory_time_window_in_hours' : host_url + '/memory/interval/timeWindowInHours',  
  
// Announcement
  'post_announcement'	:	host_url + '/message/announcement',
  'get_announcement'	:	host_url + '/messages/announcement'
};
