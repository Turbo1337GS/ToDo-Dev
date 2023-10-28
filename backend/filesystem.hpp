
#define _DEFINE_BINARY_OPERATOR
#include "includes.hpp"
using json = nlohmann::json;
class FileSystem
{
private:
    struct Data
    {
        std::string Title;
        std::string ShortDes;
        std::string Body;
    };

    std::string JsonFile = "Tasks.json";

    bool parseJson(const std::string &jsonString, Data &data)
    {
        try
        {
            std::stringstream ss(jsonString);
            boost::property_tree::ptree pt;
            boost::property_tree::read_json(ss, pt);

            data.Title = pt.get<std::string>("Title");
            data.ShortDes = pt.get<std::string>("ShortDes");
            data.Body = pt.get<std::string>("Body");

            return true;
        }
        catch (const std::exception &ex)
        {
            std::cerr << "JSON parsing error: " << ex.what() << std::endl;
            return false;
        }
    }
    size_t countEntriesInJsonFile()
    {
        std::ifstream f(JsonFile);
        size_t count = 0;

        if (f.peek() == std::ifstream::traits_type::eof())
        {
            nlohmann::json j = nlohmann::json::array();
            std::ofstream out(JsonFile);
            out << j.dump(4) << std::endl;
            out.close();
        }
        else
        {
            nlohmann::json j;
            f >> j;
            count = j.size();
        }

        return count;
    }

    Data Parsed(std::string &jsonStr)
    {
        Data data;
        parseJson(jsonStr, data);
        return data;
    }

    std::string createJsonAndSave(std::string &jsonStr)
    {
        auto parsed = Parsed(jsonStr);
        nlohmann::json j;

        // Count the existing entries in the JSON file and add 1 for new ID
        std::string newID = std::to_string(this->countEntriesInJsonFile() + 1);

        j[newID] = {{"Title", parsed.Title}, {"ShortDes", parsed.ShortDes}, {"Body", parsed.Body}};

        return j.dump(4);
    }
    bool removeById(nlohmann::json &node, const std::string &id)
    {
        if (node.is_array())
        {
            for (auto it = node.begin(); it != node.end(); ++it)
            {
                if ((*it).is_array() && (*it)[0] == id)
                {
                    node.erase(it);
                    return true;
                }
            }
        }
        return false;
    }

    bool checkTreeExists(const std::string &title)
    {
        std::ifstream f(JsonFile);

        if (!f.is_open())
        {
            std::cout << "Unable to open file Tasks.json!" << std::endl;
            return false;
        }

        try
        {
            // Parse the file's content as a JSON object
            json data;
            f >> data;

            // Check if a tree with the given title exists
            for (const auto &item : data)
            {
                const std::string &treeTitle = item[1]["Title"].get<std::string>();

                if (treeTitle == title)
                {
                    return true; // Found a tree with the given title
                }
            }

            return false; // No tree with the given title found
        }
        catch (const std::exception &e)
        {
            std::cout << "Error parsing JSON file: " << e.what() << std::endl;
            return false;
        }
    }

    void removeEntryById(std::string &JsonStr, const std::string &FileName)
    {
        try
        {
            nlohmann::json j = nlohmann::json::parse(JsonStr);

            std::string idToRemove;
            if (j.contains("ID"))
            {
                idToRemove = j["ID"];
            }

            std::ifstream file(FileName);
            if (!file)
            {
                std::cerr << "Error when read JSON." << std::endl;
                return;
            }

            nlohmann::json jsonFromFile;
            file >> jsonFromFile;

            if (removeById(jsonFromFile, idToRemove))
            {
                std::cout << "Deleted: " << idToRemove << std::endl;
            }
            else
            {
                std::cout << "Not found ID: " << idToRemove << std::endl;
            }

            std::ofstream outFile(FileName);
            outFile << jsonFromFile.dump(4);
        }
        catch (const std::exception &e)
        {
            std::cerr << "Error parsing JSON: " << e.what() << std::endl;
        }
    }

public:
    bool Action(const std::string &jsonString, std::string Name = "GET")
    {
        try
        {
            std::stringstream ss(jsonString);
            boost::property_tree::ptree pt;
            boost::property_tree::read_json(ss, pt);
            std::string Action;
            Action = pt.get<std::string>("Action");
            if (Action == Name)
                return true;
        }
        catch (const std::exception &ex)
        {
            std::cerr << "JSON parsing error: " << ex.what() << std::endl;
            return false;
        }
        return false;
    }

    std::string NewNote(std::string &JSON)
    {
        this->countEntriesInJsonFile();

        std::ifstream f(JsonFile);
        nlohmann::json existing_json;
        f >> existing_json;
        f.close();

        auto new_note_json_str = createJsonAndSave(JSON);
        auto new_note_json = nlohmann::json::parse(new_note_json_str);
        std::string new_note_title = new_note_json.begin().value()["Title"];

        bool found = false;

        // Check if an entry with the same Title already exists
        for (auto &item : existing_json)
        {
            if (item[1]["Title"] == new_note_title)
            {
                // Update the existing item Body and ShortDes
                item[1]["Body"] = new_note_json.begin().value()["Body"];
                item[1]["ShortDes"] = new_note_json.begin().value()["ShortDes"];
                found = true;
                break;
            }
        }

        // If not found, add new entry
        if (!found)
        {
            for (nlohmann::json::iterator it = new_note_json.begin(); it != new_note_json.end(); ++it)
            {
                existing_json.push_back({it.key(), it.value()});
            }
        }

        std::string new_note_str = existing_json.dump(4);

        std::ofstream f_out(JsonFile);
        if (f_out)
        {
            f_out << new_note_str << std::endl;
        }
        else
        {
            std::cerr << "Please check permission access to file: " << JsonFile << std::endl;
        }

        return new_note_str;
    }

    void Remove(std::string &Data)
    {
        removeEntryById(Data, JsonFile);
    }

    std::string GetData()
    {
        std::ifstream f(JsonFile);
        if (f.is_open())
        {
            std::stringstream ss;
            ss << f.rdbuf();
            return ss.str();
        }
        return "Fail when open files Tasks.json\n";
    }
};

extern FileSystem *FS;
