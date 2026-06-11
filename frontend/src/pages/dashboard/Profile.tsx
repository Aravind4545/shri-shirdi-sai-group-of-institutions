import { useOutletContext } from 'react-router-dom';
import { UserCircle, MapPin, Building, GraduationCap, Calendar, Mail, Phone } from 'lucide-react';

const Profile = () => {
  const { user, themeColor, textColor } = useOutletContext<any>();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Cover */}
        <div className={`h-32 ${themeColor} relative`}>
          <div className="absolute -bottom-12 left-8">
            <div className={`w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-3xl font-bold text-white ${themeColor}`}>
              {user.fullName.charAt(0)}
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{user.fullName}</h1>
              <p className={`font-semibold ${textColor} mt-1`}>{user.programInfo.program} Student ({user.programInfo.stream})</p>
            </div>
            <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm border border-gray-200">
              Student ID: {user._id.substring(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" /> {user.email}
                </li>
                <li className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" /> {user.mobileNumber}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600">
                  <UserCircle className="w-5 h-5 mr-3 text-gray-400" /> Gender: {user.gender}
                </li>
                <li className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-gray-400" /> DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <GraduationCap className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-bold text-gray-800">{user.academicInfo.intermediateYear}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <Building className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">College</p>
                  <p className="font-bold text-gray-800">{user.academicInfo.collegeName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <MapPin className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-bold text-gray-800">{user.academicInfo.state}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
