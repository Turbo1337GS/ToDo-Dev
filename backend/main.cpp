#define BOOST_BIND_GLOBAL_PLACEHOLDERS

#include "filesystem.hpp"

using namespace boost::asio;
namespace http = boost::beast::http;
using tcp = ip::tcp;

FileSystem *FS = new FileSystem();

int main()
{
    try
    {
        std::cout << "Server started\n";
        io_context io_context;
        tcp::acceptor acceptor(io_context, tcp::endpoint(tcp::v4(), 1337));

        while (true)
        {
            tcp::socket socket(io_context);
            acceptor.accept(socket);
            boost::beast::flat_buffer buffer;
            http::request<http::string_body> request;

            http::read(socket, buffer, request);

            std::string data = request.body();
            http::response<http::string_body> response;
            std::cout << data << std::endl;
            response.version(request.version());
            response.result(http::status::ok);
            response.set(http::field::content_type, "application/json");
            response.set(http::field::access_control_allow_origin, "*");
            response.set(http::field::access_control_allow_methods, "POST, GET, OPTIONS");
            response.set(http::field::access_control_allow_headers, "Content-Type");

            try
            {
                std::string res = "";
                if (!data.empty())
                {

                    if (FS->Action(data))
                    {
                        res = FS->GetData();
                    }
                    else if (FS->Action(data, "Remove"))
                    {
                        FS->Remove(data);
                    }
                    else
                    {
                        FS->NewNote(data);
                    }
                }
                response.body() = res;
                response.prepare_payload();
                http::write(socket, response);
                socket.shutdown(tcp::socket::shutdown_both);
                socket.close();
            }
            catch (std::exception &e)
            {
                std::cerr << "Exception: " << e.what() << std::endl;
            }
        }
    }
    catch (std::exception &e)
    {
        std::cerr << "Exception: " << e.what() << std::endl;
    }

    return 0;
}
