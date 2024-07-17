import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Repository } from '../../type';
import { RiArrowLeftLine, RiGitCommitLine, RiUserLine, RiCalendarLine } from 'react-icons/ri'; // Import icons from React Icons

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

const RepoDetail = () => {
  const router = useRouter();
  const { name } = router.query;
  const [repo, setRepo] = useState<Repository | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);

  useEffect(() => {
    const getRepo = async () => {
      if (name && typeof name === 'string') {
        try {
          const response = await axios.get(`https://api.github.com/repos/freeCodeCamp/${name}`);
          setRepo(response.data);
        } catch (error) {
          console.error('Error fetching repo:', error);
        }
      }
    };

    const getCommits = async () => {
      if (name && typeof name === 'string') {
        try {
          const response = await axios.get(`https://api.github.com/repos/freeCodeCamp/${name}/commits`);
          setCommits(response.data);
        } catch (error) {
          console.error('Error fetching commits:', error);
        }
      }
    };

    getRepo();
    getCommits();
  }, [name]);

  if (!repo) return <div>Loading...</div>;

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-4">
      <div className="container mx-auto">
        <Link href="/" passHref>
          <div className="flex items-center text-blue-500 cursor-pointer mb-4">
            <RiArrowLeftLine className="mr-2" />
            Back to list
          </div>
        </Link>
        <h1 className="text-3xl font-bold mb-2">{repo.name}</h1>
        <p className="text-[#8D96A0] mb-4">{repo.description}</p>
        <div className="bg-gray-800 p-4 rounded-md mb-4">
          <h2 className="text-2xl font-semibold mb-4">Commits</h2>
          <ul>
            {commits.map((commit) => (
              <li key={commit.sha} className="border border-gray-700 p-4 mb-4 rounded bg-gray-900 shadow-md">
                <p className="text-xl font-semibold text-blue-500 mb-2 flex items-center">
                  <RiGitCommitLine className="mr-2" />
                  {commit.commit.message}
                </p>
                <p className="text-gray-400 mb-1 flex items-center">
                  <RiUserLine className="mr-2" />
                  {commit.commit.author.name}
                </p>
                <p className="text-gray-500 flex items-center">
                  <RiCalendarLine className="mr-2" />
                  {new Date(commit.commit.author.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RepoDetail;
