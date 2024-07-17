import { useEffect, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { RiStarLine, RiTimeLine } from 'react-icons/ri';
import { Repository } from '../type';
import { fetchRepositories } from '../lib/github';

dayjs.extend(relativeTime);

const Home = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15; // Number of repositories per page

  useEffect(() => {
    const getRepos = async () => {
      const data = await fetchRepositories();
      setRepos(data);
      setFilteredRepos(data);
    };
    getRepos();
  }, []);

  useEffect(() => {
    // Reset to the first page whenever filteredRepos changes
    setCurrentPage(1);
  }, [filteredRepos]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setFilteredRepos(repos.filter(repo => repo.name.toLowerCase().includes(term.toLowerCase())));
    } else {
      setFilteredRepos(repos);
    }
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    let sortedRepos = [...filteredRepos];
    if (option === 'stars') {
      sortedRepos = sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (option === 'updated') {
      sortedRepos = sortedRepos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    setFilteredRepos(sortedRepos);
  };

  // Pagination functions
  const goToPreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  // Calculate pagination data
  const lastIndex = currentPage * pageSize;
  const firstIndex = lastIndex - pageSize;
  const currentRepos = filteredRepos.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredRepos.length / pageSize);

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src="./home.png" // Replace with the path to your profile image
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <div>
            <h1 className="text-3xl font-bold">shtewari23</h1>
            <button className="mt-2 px-4 py-2 bg-gray-400 hover:bg-gray-700 rounded">Edit profile</button>
          </div>
        </div>
        <div className='mt-5 relative'>
        <h2 className="text-2xl font-semibold mb-4 ">Repositories</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-md mt-8">
          <div className="flex justify-between mb-4 space-x-4 mr-1">
            <input
              type="text"
              placeholder="Find a repository..."
              className="w-1/3 p-4 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-300"
              value={searchTerm}
              onChange={handleSearch}
            />
            <select
              className="w-1/3 p-4 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-300"
              value={sortOption}
              onChange={handleSort}
            >
              <option value="">Sort by</option>
              <option value="stars">Stars</option>
              <option value="updated">Last Updated</option>
            </select>
          </div>
          <ul>
            {currentRepos.map((repo) => (
              <li key={repo.id} className="border border-gray-700 p-4 mb-4 rounded bg-gray-900 shadow-md">
                <Link href={`/repos/${repo.name}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold text-blue-500 hover:underline">{repo.name}</p>
                    <span className="flex items-center text-gray-400 ml-auto">
                      <RiStarLine className="w-5 h-5 mr-1" />
                      {repo.stargazers_count}
                    </span>
                  </div>
                </Link>
                <p className="text-[#8D96A0] mt-2">{repo.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span className="flex items-center mr-2">
                    <RiTimeLine className="w-4 h-4 mr-1" />
                    Last updated: {dayjs(repo.updated_at).fromNow()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          </div>
          </div>
          
          {/* Pagination controls */}
          <div className="flex justify-center mt-4 absolute ml-44" style={{marginLeft:"40%",marginBottom:'1%'}}>
            <button
              className={` px-4 py-2 bg-gray-400 hover:bg-gray-700 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-300 p-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`ml-4 px-4 py-2 bg-gray-400 hover:bg-gray-700 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
    
    </div>
  );
};

export default Home;
