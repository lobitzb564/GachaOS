import json
import re

"""
Per Each:
  GPU%, GPU Time Energy use, Networks
"""

if __name__ == "__main__":
    with open("test.txt") as f:
        file_contents = f.readlines()
    final_dict = {}
    #Gets Total Threads, Total Processes, Total CPU percentage, Memory free and memory used
    final_dict["Num_processes"] = int(re.search(r"([0-9]*) total", file_contents[1]).groups()[0])
    final_dict["total_cpu_percentage"] = float(re.search(r"([0-9\.]*) us", file_contents[2]).groups()[0])
    final_dict["mem_free"] = float(re.search(r"([0-9.]*) free", file_contents[3]).groups()[0])
    final_dict["mem_used"] = float(re.search(r"([0-9.]*) used", file_contents[3]).groups()[0])+ float(re.search(r"([0-9.]*) buff/cache", file_contents[3]).groups()[0])
    file_contents = file_contents[7:]
    application_list = []
    for line in file_contents:
        temp_dict = {}
        vals = line.strip().split(" ")
        vals = [val for val in vals if (val!= " " and len(val) > 0)]
        temp_dict["pid"] = vals[0]
        temp_dict["usr"] = vals[1]
        temp_dict["cpu_percent"] = vals[8]
        temp_dict["mem_percent"] = vals[9]
        temp_dict["command"] = vals[11]
        temp_dict["time"] = vals[10]
        application_list.append(temp_dict)
    final_dict["Individual_application_info"] = application_list
    with open("temperature.txt") as f:
        res = re.search("(\+[0-9\.]*).F  \(crit = \+([0-9\.]*)", f.readlines()[1]).groups()
        final_dict["cpu_temp"] = res[0]
        cpu_temp = float(res[0])
        if float(res[1])- cpu_temp < 20:
            final_dict["Heat-Alert"] = True
        else:
            final_dict["Heat-Alert"] = False
    final_json = json.dumps(final_dict)
    print(final_json)
