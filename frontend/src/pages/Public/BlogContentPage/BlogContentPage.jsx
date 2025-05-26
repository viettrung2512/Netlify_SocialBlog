import  NavBar  from "../../../components/Header/NavBar";
import  SideBar  from "../../../components/Sidebar/SideBar";
import  BlogContent  from "../../../components/Blog/BlogContent";
import { useParams } from "react-router-dom";

const BlogContentPage = () => {
  const { id } = useParams();

  return (
    <div className="bg-white min-h-screen text-black">
      <header>
        <NavBar />
      </header>
      <main>
        <div className="flex">
          <div className="w-60">
            <SideBar />
          </div>
          <div className={"flex-grow ml-4"}>
            <BlogContent key={id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogContentPage;
