import { motion } from 'framer-motion';

const JobCard = ({ job, index }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently Posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const truncateText = (text, maxLength = 95) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // ✅ Correct JSearch API field names
  const title = job.job_title || 'Job Title';
  const company = job.employer_name || 'Company Name';
  const description = job.job_description || '';
  const applyUrl = job.job_apply_link || '#';
  const postedDate = formatDate(job.job_posted_at_datetime_utc);
  const employmentType = job.job_employment_type || '';
  const logo = job.employer_logo || null;

  const locationParts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
  const location = locationParts.join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {logo && (
            <img
              src={logo}
              alt={company}
              className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1 flex-shrink-0"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
        {job.job_match && (
          <div className="ml-3 flex-shrink-0 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/50">
            <span className="text-sm font-bold text-green-400">{job.job_match}%</span>
          </div>
        )}
      </div>

      {/* Company */}
      <p className="text-blue-400 font-semibold mb-3 hover:text-blue-300 transition-colors">
        {company}
      </p>

      {/* Description */}
      {description && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {truncateText(description)}
        </p>
      )}

      {/* Meta */}
      <div className="space-y-2 mb-4 text-sm">
        {location && (
          <div className="flex items-center text-gray-400">
            <span className="mr-2">📍</span>
            <span className="truncate">{location}</span>
          </div>
        )}
        <div className="flex items-center text-gray-400">
          <span className="mr-2">📅</span>
          <span>{postedDate}</span>
        </div>
        {employmentType && (
          <div className="flex items-center text-purple-400">
            <span className="mr-2">💼</span>
            <span>{employmentType}</span>
          </div>
        )}
      </div>

      {/* Apply button */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-200 inline-block"
      >
        Apply Now →
      </motion.a>
    </motion.div>
  );
};

export default JobCard;