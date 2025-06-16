import React from "react";

const UserList = ({ users, currentUser, onUserClick, selectedUser }) => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Online Users ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map((user) => {
          const isCurrentUser = user.username === currentUser.username;
          const isSelected = user.username === selectedUser;

          return (
            <div
              key={user.id}
              onClick={() => !isCurrentUser && onUserClick(user.username)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isCurrentUser
                  ? "bg-slate-700/30 border border-slate-600/50"
                  : isSelected
                  ? "bg-purple-500/20 border border-purple-500/50 cursor-pointer"
                  : "hover:bg-slate-700/50 cursor-pointer"
              }`}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full bg-slate-600"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isCurrentUser ? "text-blue-400" : "text-slate-200"
                  }`}
                >
                  {user.username}
                  {isCurrentUser && " (You)"}
                </p>
                <p className="text-xs text-slate-400">Online</p>
              </div>
              {!isCurrentUser && (
                <div className="w-2 h-2 bg-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
