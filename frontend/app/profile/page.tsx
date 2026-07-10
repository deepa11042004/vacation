"use client";

import {
  Ticket,
  Users,
  Award,
  ArrowUpRight,
  MapPin,
  Calendar,
  CreditCard,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ProfileDashboardPage() {
  const stats = [
    {
      title: "Total Bookings",
      value: "12",
      trend: "+2 this month",
      icon: Ticket,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Referrals",
      value: "4",
      trend: "+1 this week",
      icon: Users,
      color: "bg-violet-500",
      lightColor: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      title: "Reward Points",
      value: "2,450",
      trend: "Top 15% of users",
      icon: Award,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "booking",
      title: "Booked Santorini Coastal Villa",
      date: "2 days ago",
      icon: MapPin,
      status: "Confirmed",
      amount: "$1,250",
    },
    {
      id: 2,
      type: "reward",
      title: "Earned Referral Bonus",
      date: "1 week ago",
      icon: Sparkles,
      status: "Credited",
      amount: "+500 pts",
    },
    {
      id: 3,
      type: "payment",
      title: "Payment for Swiss Alps",
      date: "2 weeks ago",
      icon: CreditCard,
      status: "Processed",
      amount: "$850",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-400 to-blue-600 text-white p-8 md:p-12 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-white border border-white/20 inline-block p-1 px-2 rounded-full bg-white/20 backdrop:backdrop-blur-lg font-medium tracking-wide text-sm uppercase mb-2">
              Member Dashboard
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-marcellus mb-4 leading-tight">
              Welcome back, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-white">
                John Doe
              </span>
            </h2>
            <p className="text-white max-w-md text-lg">
              You are just 550 points away from unlocking Platinum tier
              benefits. Keep exploring!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-blue-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl ${stat.lightColor} text-slate-700 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className="flex items-center text-emerald-500 text-sm font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-500 font-medium mb-1">{stat.title}</p>
            <h3 className="text-4xl font-bold text-slate-800 tracking-tight font-marcellus">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800 font-marcellus">
              Recent Activity
            </h3>
            <button className="text-blue-600 font-medium hover:text-blue-700 text-sm flex items-center transition-colors">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-6 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div
                    className={`shrink-0 p-4 rounded-2xl ${
                      activity.type === "booking"
                        ? "bg-blue-50 text-blue-600"
                        : activity.type === "reward"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-violet-50 text-violet-600"
                    } group-hover:scale-105 transition-transform duration-300`}
                  >
                    <activity.icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-slate-800 truncate">
                      {activity.title}
                    </h4>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1.5 opacity-70" />
                      {activity.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        activity.type === "reward"
                          ? "text-emerald-500"
                          : "text-slate-800"
                      }`}
                    >
                      {activity.amount}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Membership Tier & Quick Actions */}
        <div className="space-y-8">
          {/* Tier Card */}
          <div className="bg-black rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-400 font-medium mb-1">
                    Current Tier
                  </p>
                  <h3 className="text-2xl font-bold font-marcellus text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-yellow-500">
                    Gold Member
                  </h3>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">2,450 pts</span>
                  <span className="text-slate-300">3,000 pts</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-amber-400 to-yellow-500 w-[82%] rounded-full relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Earn 550 more points to reach Platinum
                </p>
              </div>
            </div>
          </div>

          {/* Special Offer Ad */}
          <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 relative overflow-hidden group cursor-pointer">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110"></div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                Special Offer
              </span>
              <h3 className="text-xl font-bold text-slate-800 font-marcellus mb-2">
                Double Points Weekend
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Book any destination this weekend and earn double reward points
                on your trip.
              </p>
              <button className="text-blue-600 font-bold flex items-center group-hover:text-blue-700 transition-colors">
                Claim Offer{" "}
                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
