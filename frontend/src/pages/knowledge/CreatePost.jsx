import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import knowledgeService from '../../services/knowledgeService';
import PostEditor from '../../components/knowledge/PostEditor';

export const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePublish = async (postData) => {
    setLoading(true);
    try {
      const res = await knowledgeService.createPost(postData);
      if (res.data) {
        navigate('/knowledge');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PostEditor onSubmit={handlePublish} loading={loading} />
    </div>
  );
};

export default CreatePost;
